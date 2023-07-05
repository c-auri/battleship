# Battleship
This is the final project in the [Testing JavaScript](https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript#testing-javascript) section of [The Odin Project](https://www.theodinproject.com). Since I had previous experience with unit testing, I had little trouble writing the tests themselves. To add an extra challenge, I therefore implemented an AI that goes a bit beyond what is described in the assignment. It's by no means perfect, but it's good enough to reliably win against intuitive human players.

All in all, I think this is fun project that illustrates the importance of unit tests very well. Working with jagged arrays introduces many opportunities for mixed up indices and can therefore lead to bugs that are hard to catch without a thorough test suite.

## Rules
When looking at different implementations of the Battleship game I noticed a variety of different rules. The original game has a strictly alternating turn order and allows placing ships right next to each other. However, I saw versions that allowed follow up attacks if the first attack hit a ship and versions that did not allow ships to "touch" each other.

When play-testing the original version I found it too boring and decided to adopt the restricted ship placement rule, as it brings some additional tactical depth to the player choices. However, I decided against adopting the follow up attack rule, since it seemed to lead to players gaining too large of an advantage from a lucky start.

## AI
The computer player chooses their move based on an evaluation function, that estimates the importance of each remaining coordinate on the game board. The algorithm is as follows:

1. Give a numerical value to each coordinate on the board that is still in the fog of war:

    - Minus Infinity: If the coordinate is a diagonal neighbor to a previous hit OR if the coordinate has no space in either direction to fit even the smallest remaining ship. (If either of those is true, the coordinate can not be a ship.)
    - Infinity: If the coordinate is a direct neighbor to a previous hit. (If this is true, the coordinate has a high likelyhood to be a ship and should be preferred.)
    - If neither of those things apply, calculate the value based on the coordinates capacity to fit any one of the remaining ships. The more ships can fit into that coordinate, the higher the value.

2. Select the coordinates with the highest numerical value and attack one of them at random.

This very simple algorithm proves to be surprisingly effective: 

The combination of the first and second bullet points (prefer direct neighbors of previous hits, but avoid diagonal neighbors) makes the AI attack in a straight line once a ship is hit twice without specifying a dedicated rule for that behaviour. The capacity-based evaluation in the third bullet point then gives a nice heuristic to find the most valuable targets if no information about previous hits is available. It leads to a diagonal attack pattern that prioritizes the largest "holes" on the bord, which generally seems to be the optimal strategy to me.

However, the AI does not pay attention to the potential information value of a coordinate. Since ships can not be placed directly next to each other, sinking a ship clears up all the neighboring coordinates and gives out extra information. It would therefore be advantageous to continue an initial hit with attacks in the direction that would clear up the most fog of war should they lead to the sinking of a ship.

## Ship placement
The AI relies on a randomized ship placement and could be exploited by purposefully chosing sub-optimal placement strageties, e. g. placing all the ships on the edge of the board. A human player would be able to notice such behaviour and adapt their strategy in the following rounds accordingly. However, since the AI is not able to adapt like a human, I chose not to add a manual ship placement in the beginning of the game. The ships will always be placed at random for both sides.


## Backlog
- Configurable placement rules:
    - Fleet selection
    - Disable enforced gap