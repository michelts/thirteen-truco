# Postmortem

When the competition started, I didn't have a cool idea that aligned with the theme. I did some research on past entries and asked for help from ChatGPT, but nothing was appealing enough to me.

At that time, I was playing the card game Truco with family members once a week, and since I love this game, I saw it as a great opportunity to implement something I liked.

Besides, I could potentially turn it into a multiplayer game after the competition.

## Game Design

Once again, I asked ChatGPT for help, and my initial feedback wasn’t great. I don’t have the screenshot anymore, but here’s my interpretation of it:

![first-layout](https://github.com/michelts/thirteen-truco/blob/main/docs/first-layout.gif)

A few iterations later, and after analyzing existing games, my final layout improved a bit:

![first-layout](https://github.com/michelts/thirteen-truco/blob/main/docs/second-layout.gif)

As you can see, I focused on a mobile-first approach, making it easier for regular people to play the game. In Brazil, [64% of the population navigates the web exclusively through cellphones](https://agenciabrasil-ebc-com-br.translate.goog/geral/noticia/2022-06/classes-b-c-d-e-e-tem-menos-acesso-computadores-desde-pandemia?_x_tr_sl=pt&_x_tr_tl=en&_x_tr_hl=pt-BR&_x_tr_pto=wapp).

## Implementation

Since my goal was to eventually make the game multiplayer, I decided to completely separate the UI from the game mechanics. This allowed me to apply TDD (Test-Driven Development) while building the game, so all of my engine was thoroughly tested.

Games in general use a lot of randomness, and mine is no different. To make my tests predictable, I used dependency injection. TypeScript made this a breeze: for example, the game class constructor has a deck parameter, and the deck class itself takes a sorter function parameter. In my tests, I simply [injected a deck with a dummy sorter](https://github.com/michelts/thirteen-truco/blob/main/src/games/truco/__tests__/game.test.ts#L17).

## Game Logic

The game logic isn't too difficult: players compete with 3 cards in rounds of 3 steps. You win the round if you win two steps or if you win the first step and draw the second, plus a few edge cases. Dependency injection helped again: I could test all combinations of a win [without worrying about the cards or the game in general](https://github.com/michelts/thirteen-truco/blob/main/src/games/truco/__tests__/getRoundScore.test.ts).

The order of the cards is another auxiliary element: I assume my cards are already sorted by default, and I just need to identify the trumps (cards that beat all others, determined by the card immediately after the turned card). This logic was also isolated for easy testing of edge cases.

With all of that defined, the core gameplay wasn't hard to implement, all while not worrying about the UI.

The UI interacts with the game instance and refreshes specific parts of the screen when something in the game happens, using custom DOM events. For example, when the human player drops a card, I call the game.dropCard method and trigger a cardDropped event. The human player’s hand, the table cards, and a few other elements refresh their content in response to this event.

The key takeaway is: avoid unnecessary coupling! This approach let me focus on specific elements one at a time, and I got features like support for 2 and 4 players almost for free!

## Matching the Theme

To align with the theme, I introduced a special card with the number 13. This card is lower than all others and displays the value of another card until it is played. A simple trick that made the game even more fun (as this card can affect either you or your opponents).

## Auto-Playing Cards

You play against the computer, and random decisions wouldn’t make for good computer player behavior.

I'm not the best Truco player, but being part of a family that plays it often, I know a few strategies. I wrote a function to determine which card to [play depending on the situation](https://github.com/michelts/thirteen-truco/blob/main/src/games/truco/__tests__/autoPickCard.test.ts).

For instance, if the turned card is a 4 and the auto-player has the five of clubs and the five of hearts (the highest cards in the game), the player will drop the lowest card and save the higher ones for the 2nd and 3rd rounds to raise the stakes!

Be aware that the computer player can bluff. If it's the 3rd step of the round and the computer player has a low card, there’s a small chance they'll raise the stakes anyway (now using randomness).

## Sound

I really wanted to use *Ace of Spades* by *Motörhead* as inspiration for my game’s music. However, for some reason, my bluesy side made me choose *[I'm Shakin'](https://www.youtube.com/watch?v=qWRjus3end4)* by
*Little Willie John*. The music notes are derived from this track.

Credits also to [Chris Wilson's SoundBox](https://sb.bitsnbites.eu/), which I used for composing the sound effects.

## Size constraints

I mostly relied on CSS effects, backgrounds, animations, and native UTF-8 characters to implement the UI. This saved a lot of space, but near the end, my game was growing to the point where I had to be cautious about adding new features.

I had my own Vite config to build the project, and luckily, someone shared a link to [Cody Ebberson's js13k-vite-plugins](https://github.com/codyebberson/js13k-starter). That made a big difference and saved me 2KB, enough to add sound and more features easily!

## Finishing the game

With the UI and game mechanics in good shape, I realized one big issue: Truco isn’t popular worldwide, and even where it is played, there are subtle (or not so subtle) variations in the rules.

At first, I thought it would be simple: since my UI and game mechanics were decoupled, I could easily create a tutorial class that respects the same game interface and demonstrates how to play.

However, the time limit was an issue: I wouldn’t have enough time to implement this feature. I ended up adding a help screen with instructions and some new UI elements to indicate whose turn it is or who won the round, but it was just a temporary fix. There’s still room for improvement.

After compo, I recorded video-demonstrations that could be helpful for any newcomer:

### You vs computer

https://github.com/user-attachments/assets/59dd3fd9-d53e-418a-b762-c7c0be014f61

### You and a partner vs two computers

https://github.com/user-attachments/assets/1e17beaf-9878-4861-9945-82e76964a320

## Next steps

As time allows, I plan to add a few things I couldn’t include in the game yet:

### Sharing Signs

In real Truco, players use visual signals, like blinking if they have the trump of clubs or licking their lips if they hold the trump of diamonds. I want to add this to the game so your computer partner can make better decisions (and potentially your opponents too, if they catch your signals).

### Multiplayer Support

This game is really fun when playing against human opponents. The player interface is ready for remote play, and since the game is based on a clean interface, I could easily implement multiplayer support.

### Machine Learning

Using large language models (LLMs) doesn’t seem very useful here. Although they know the rules, their decisions aren’t always optimal. I’d likely need to define edge cases, much like my own game’s auto-play mechanic, which would be an unnecessary resource expenditure.

However, training a lightweight model to play the cards could be a viable approach!

## Conclusion

The js13k-games competition is no easy task, and with only a few weekends and early mornings available to work on it—while balancing work and family—I must congratulate all contestants on their accomplishments!

Special thanks to the game organizers, Ender and Alkor, and all the js13k community for their passion and dedication to the competition!
