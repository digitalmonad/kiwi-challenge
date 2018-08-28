# Kiwi.com code challenge for WebExpo 2018

## What is the task?

You’ll start by converting the following string:

>kiwi.com\u0000

Into three colours which we will call E, M, O for their names.
Now solve the formula for colour X:

>K = rotate(multiply(screen(E, M), O)) + X

Where

* K is the Kiwi.com brand color #00a991
* rotate() rotates Hue color by 120°
* multiply() and screen() are common color blending operations
