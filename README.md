# Discord Deckmaster Bot

Deckmaster is a [Discord](https://discord.com/) bot for creating
card decks and drawing cards for online play of tabletop games.

## Running and preparing a deck

The facilitator of the game needs to change the following variables in index.js:

- imgfolder: point it to a local folder containing all the individual images
(e.g. jpg, png) of the cards your deck should consist of. One image per card is
required.

- add the bot's auth token

- Run node . 

## Using from discord

Once the bot is online in a server, the folowing commands can be used:

- createdecks: reset the deck to the contents of the imgfolder folder.

- draw: privately draw a card. THe card image is sent privately to the player
  that issued the command.

- flip: a card is drawn and revealed publicly in the channel 

- drawrotate: privately draw a card. The card is sent to the user twice, once 
  upright and once upside-down. This is needed for convenience in very
  specific games, e.g. "The Shab-Al-Hiri Roach" rpg has the players read
  text on either direction of a card depending on the player's role.

