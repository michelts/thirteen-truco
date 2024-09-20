# Postmortem

When the competition had started, I didn't have a cool idea that would be in
touch with theme. I did some research on past entries and asked for some
ChatGPT help, but I got nothing that was appealing enough for me.

At that point, I was playing this card game Truco with family members once a
week and I love the game, it was a good opportunity to implement something I'd
like.

Besides that I could potentially turn it into a multiplayer game after compo.

## Game design

Again I asked ChatGPT for help, and my initial feedback wasn't great. I don't
have the screen anymore, but I have my interpretation of it:

![first-layout](https://github.com/michelts/thirteen-truco/blob/post-mortem/docs/first-layout.gif)

A few iterations later and after navigating through existing games, my final
layout was a little improved:

![first-layout](https://github.com/michelts/thirteen-truco/blob/post-mortem/docs/second-layout.gif)

As you can see, I focused on a mobile-first approach with the idea regular
people could play the game. In Brazil, [64% of the population navigates the web
exclusively through cellphones](https://agenciabrasil-ebc-com-br.translate.goog/geral/noticia/2022-06/classes-b-c-d-e-e-tem-menos-acesso-computadores-desde-pandemia?_x_tr_sl=pt&_x_tr_tl=en&_x_tr_hl=pt-BR&_x_tr_pto=wapp).

## Implementation

With my goal to turn the game also a multiplayer game, I decided to completely
separate the UI from the game mechanics. That allowed to apply TDD while
developing the game so all my engine is tested.

Games in general uses a lot of random and mine is no different. To make my
tests predictable, I'm using dependency injection. Typescript makes it a breeze:
for instance, the game class constructor has a deck parameter and the deck
class itself has a sorter function parameter. On tests, [I just had to inject a
deck with a dummy sorter](https://github.com/michelts/thirteen-truco/blob/post-mortem/src/games/truco/__tests__/game.test.ts#L17).

## Game logic

The game logic is not that difficult: players compete with 3 cards on rounds of
3 steps. I win the round if I win two steps, or if I win the first step and
draw the second, plus a couple of edge cases. Again dependency injection was my
friend here: I could test all the combinations of a win without even caring
about cards and the game in general. [link to that]

The order of the cards is also something accessory: I'm assuming my cards are
already sorted by default and I just need to identify the trumps (cards that
win all others and defined by the card immediately after the turned card). This
is also something I could isolate for easy testing of edge cases.

With all of that defined, the game playing wasn't difficult to implement, all
without caring about UI.

The UI would use the game instance and only refresh specific portions of the
screen when something in the game happened, something done with custom DOM
events. For instance, when the human player drops a card, I call the
`game.dropCard` method and trigger a `cardDropped` event. The human player
hand, the table cards and a couple of other elements would refresh their
content for this event.

The message here is: avoid unnecessary coupling! By taking this approach, I
could concentrate on specific stuff one at a time and got things like 2 and 4
players for free!

## Matching the theme

To match the theme, I introduced an special card with number 13. This card
would be lower than all others and would have as display value another card, to
only show itself after being dropped. A simple trick that made the game even
more fun (because this can impact your or your opponents as well).

## Auto playing cards

You play against the computer and random wouldn't be a great choices for the
computer player decisions.

I'm not the best truco player I know but being part of a family that plays it a
lot, I sure know something and I wrote a function to decide what card to play
depending on the case.

Suppose the turned card is a 4 and the auto-player has a five of clubs and a
five of hearts. Those are the highest cards in the game! In this case, the
player will drop the lowest card and wait you on the 2nd and 3rd round to raise
stakes!

Be mindful that the computer player can bluff. If it is the 3rd step of the
round and the computer player has a low card, there is a small chance he will
raise stakes too (now using random).

## Sound

I really wanted to use *Ace of Spades*, from *Mötorhead*, as inspiration for my
game music. For any reason my blues vein make me pick *[I'm Shakin'](https://www.youtube.com/watch?v=qWRjus3end4)*, from
*Little Willie John* so the music notes are taken from there.

Credits also to [Chris Wilson's SoundBox](https://sb.bitsnbites.eu/) which I used for composing the
some.

## Size constraints

I relied mostly on CSS effects, CSS backgrounds, animations and native utf-8
chars to implement the UI. This saved a lot of game bytes, but closer to the
end, my game was continuously growing to a point I would need to be mindful
with adding features.

I had my own vite config to build the project and luckily, someone shared a
link to [Cody Ebberson's js13k-vite-plugins](https://github.com/codyebberson/js13k-starter): that made a big difference and saved me 2kb (I think),
enough to add sound and additional features easily!

## Finishing the game

With the UI and the in a good shape, I found one big mistake: truco is not
popular across the world, and even places where it is played, there's subtle
variances (sometimes not that subtle).

At first I though it would be simple: my UI and my game is disconnected, I
could easily create a tour class that respects the same game interface and
builds a scenario I can use to demonstrate the game.

In this case, the time limit was a thing: I wouldn't have enough time to
implement this feature. I ended up with some instructions in a help screen and
new UI elements to help understanding who is the current player or who won the
round, but it is only a bandaid, there's room for improvements here.

## Next steps

As time lets me, I have a few things I couldn't include in the game just yet:

### Sharing signs

When playing real truco, I can use visual signs as blinking if I have the clubs
trump, or licking the lips if I have the diamonds one. I want to have this in
the game so your computer partner can take better decisions (and potentially
your opponents as well, as there might be a chance they caught your sign).

### Multiplayer support

This game is really fun when you are competing against humans. The player
interface is ready for a remote player. The game as well is all based on an
clear interface, I could easily write a remote game that respects the same
interface.

### Machine-learning

Usage of LLM's doesn't seem very useful. Even though they know the rules, the
decisions are not always good, I would probably need to list a couple of edge
cases just like my own game auto-play mechanic, which seems expending
unnecessary resources.

On the other hand, training a light-weight model to player the cards should be
viable!

## Conclusion

The js13k-games competition is surely not easy and with only a few weekends and
early mornings to implement it, dividing attention with work and family, I must
congratulate all contestants for the achievement!

An extra thanks for the game organizers Ender and Alkor for all the passion
about the compo!
