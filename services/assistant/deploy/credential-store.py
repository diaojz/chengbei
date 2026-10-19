#!/usr/bin/env python3
"""Root-only AES-GCM store; secrets arrive through stdin, never arguments."""
import json, os, pathlib, secrets, sys
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
ROOT=pathlib.Path('/etc/chengbei-assistant')
STORE=pathlib.Path('/var/lib/chengbei-assistant/secrets.aesgcm')
RUNTIME=pathlib.Path('/run/chengbei-assistant')
AAD=b'org.chengbei.site-assistant/v1'
NAMES={'deepseek_api_key','chat_ip_secret','turnstile_secret_key'}
def atomic(path,data,mode=0o600,uid=0):
    temp=path.with_name(path.name+'.new')
    fd=os.open(temp,os.O_WRONLY|os.O_CREAT|os.O_TRUNC|os.O_NOFOLLOW,mode)
    with os.fdopen(fd,'wb') as f:
        os.fchmod(f.fileno(),mode);os.fchown(f.fileno(),uid,uid);f.write(data);f.flush();os.fsync(f.fileno())
    os.replace(temp,path)
def main():
    if os.geteuid()!=0: raise ValueError('root required')
    ROOT.mkdir(mode=0o700,parents=True,exist_ok=True);STORE.parent.mkdir(mode=0o700,parents=True,exist_ok=True)
    keyfile=ROOT/'host.key'
    if not keyfile.exists(): atomic(keyfile,secrets.token_bytes(32))
    key=keyfile.read_bytes(); values={}
    if STORE.exists():
        data=STORE.read_bytes();values=json.loads(AESGCM(key).decrypt(data[:12],data[12:],AAD))
    command=sys.argv[1]
    if command=='import':
        incoming=json.loads(sys.stdin.buffer.read(16384))
        if not isinstance(incoming,dict) or not set(incoming)<=NAMES: raise ValueError('invalid fields')
        for name,value in incoming.items():
            if not isinstance(value,str) or not value or len(value)>4096: raise ValueError('invalid value')
        values.update(incoming);values.setdefault('chat_ip_secret',secrets.token_hex(32))
        nonce=secrets.token_bytes(12);atomic(STORE,nonce+AESGCM(key).encrypt(nonce,json.dumps(values).encode(),AAD))
        print('Credentials encrypted')
    elif command=='prepare':
        if not values.get('deepseek_api_key') or not values.get('chat_ip_secret'): raise ValueError('missing credentials')
        RUNTIME.mkdir(mode=0o700,parents=True,exist_ok=True)
        for name in NAMES: atomic(RUNTIME/name,values.get(name,'').encode(),0o400,1000)
        print('Runtime credentials prepared')
    else: raise ValueError('unknown command')
if __name__=='__main__':
    try: main()
    except Exception:
        print('Credential operation failed; no secret details logged.',file=sys.stderr);sys.exit(1)
