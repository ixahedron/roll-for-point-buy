## A simple Discord bot to randomly generate ability scores for D&D 5e.

### Want to use this?

Add the bot to your server using this link:
https://discordapp.com/oauth2/authorize?&client_id=209040908673482753&scope=bot&permissions=0

### Features

It's a really simple bot.

`/help` -- prints instructions.

`/pb` -- rolls 4d6, dropping the lowest die, 6 times, and sums up their point buy costs.

`/pb 6 24 40` -- rolls 4d6d1 6 times, rerolling until the point buy cost is at least 24 and at most 40.

`/pb 6 27` -- each successive argument is optional, i.e. you could input this to receive a roll with PB cost if at least 27.

---

The costs need some extrapolation, since the usual Point Buy system
only allows values from 8 to 15, so this bot uses custom rules
from [this popular Point Buy calculator](http://chicken-dinner.com/5e/5e-point-buy.html).
