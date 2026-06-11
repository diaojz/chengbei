# The Bottleneck in Voice Input Isn't Recognition

Before I built Typevoise, I thought the hard part was recognition.

I burned weeks on it — swapped Whisper for Apple's Speech framework and back, tuned the models. The output was still "uh you know like um yeah I think." That's when it hit me: the bottleneck in voice input has never been "can the machine hear me." It's "can it give me back a paragraph that reads like I typed it."

So I added one step: pipe the transcript through Claude to clean it up.

The app instantly became usable.

Most voice tools die at this last mile. They grind recognition accuracy from 93% to 95% — nobody wants to spend the extra 0.2 seconds on polishing.

But what users want has never been "accurate." It's "I speak, and what comes out is something I can ship."
