# Battleship
This is the final project in the [Testing JavaScript](https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript#testing-javascript) section of [The Odin Project](https://www.theodinproject.com). Since I had previous experience with unit testing, I had little trouble writing the tests themselves. To add an extra challenge, I implemented an AI that goes a bit beyond what is described in the assignment. It's by no means perfect, but it's good enough to reliably win against intuitive human players.

All in all, I think this is fun project that illustrates the importance of unit tests very well. Working with jagged arrays introduces many opportunities for mixed up indices and can therefore lead to bugs that are hard to catch without a thorough test suite.

## Game Rules
When looking at different implementations of the Battleship game I noticed a variety of different rules. The original game has a strictly alternating turn order and allows placing ships right next to each other. However, I saw versions that allowed follow up attacks if the first attack hit a ship and versions that did not allow ships to "touch" each other.

When play-testing the original version I found it too boring and decided to adopt the restricted ship placement rule, as it brings some additional tactical depth to the player choices. However, I decided against adopting the follow up attack rule, since it seemed to lead to players gaining too large of an advantage from a lucky start.

## AI
The computer player chooses their move based on an evaluation function that estimates the importance of each remaining coordinate on the game board. The algorithm is as follows:

1. Give a numerical value to each coordinate on the board that is still in the fog of war:

    - Minus Infinity: If the coordinate is a diagonal neighbor to a previous hit OR if the coordinate has no space in either direction to fit even the smallest remaining ship. (If either of those is true, the coordinate can not be a ship.)
    - Infinity: If the coordinate is a direct neighbor to a previous hit. (If this is true, the coordinate has a high likelyhood to be a ship and should be preferred.)
    - If neither of those things apply, calculate the value based on the coordinates capacity to fit any one of the remaining ships. The larger the biggest ship is that could fit into that coordinate, the higher the value.

2. Select the coordinates with the highest numerical value and attack one of them at random.

This very simple algorithm proves to be surprisingly effective: 

The combination of the first and second bullet points (prefer direct neighbors of previous hits, but avoid diagonal neighbors) makes the AI attack in a straight line once a ship is hit twice without specifying a dedicated rule for that behaviour. The capacity-based evaluation in the third bullet point then gives a nice heuristic to find the most valuable targets if no information about previous hits is available. It leads to a diagonal attack pattern that prioritizes the largest "holes" on the bord, which generally seems to be the optimal strategy to me.

However, the AI does not pay attention to the potential information value of a coordinate. Since ships can not be placed directly next to each other, sinking a ship clears up all the neighboring coordinates and gives out extra information. It would therefore be advantageous to continue an initial hit with attacks in the direction that would clear up the most fog of war should they lead to the sinking of a ship.

## Ship Placement
The AI relies on a randomized ship placement and could be exploited by purposefully chosing sub-optimal placement strageties, e. g. placing all the ships on the edge of the board. A human player would be able to notice such behaviour and adapt their strategy in the following rounds. However, since the AI is not able to adapt like a human, I chose not to add a manual ship placement in the beginning of the game. The ships will always be placed at random for both sides to protect my precious AI.


## Tests

Since this project is about testing, here is a printout of my test descriptions:

```
 PASS  tests/Ship.test.ts (8.418 s)
  constructor
    throws an error
      ✓ when provided length is too small (105 ms)
      ✓ when provided length is too large (2 ms)
  length
    ✓ returns length provided in constructor (1 ms)
  isSunk
    is false
      ✓ for a brand new ship (1 ms)
      ✓ for a ship that is not hit everywhere (1 ms)
    is true
      ✓ once a ship is hit everywhere (1 ms)

 PASS  tests/AI.test.ts (8.726 s)
  findTarget
    ✓ targets all neighbors of previous isolated hit (24 ms)
    ✓ ignores misses next to previous hit (6 ms)
    ✓ ignores diagonal neighbors of previous hit (12 ms)
    ✓ ignores side neighbors of previous consecutive hits (5 ms)
    ✓ ignores diagonal neighbors of previous miss (21 ms)
    ✓ ignores coordinates that can not fit smallest ship (1) (5 ms)
    ✓ does not ignore end of ship if first coordinate after it is a miss (4 ms)
    ✓ prefers neighbors of previous hits over high capacity candidates (16 ms)

 PASS  tests/Board.test.ts (8.913 s)
  constructor
    ✓ does not throw (7 ms)
  allAreSunk
    returns true
      ✓ for empty board (2 ms)
      ✓ when the only ship got destroyed (3 ms)
    returns false
      ✓ for non-empty board without attacks (1 ms)
      ✓ when previous attacks all missed (1 ms)
      ✓ when ship got hit but not destroyed (1 ms)
      ✓ when one ship got destroyed but another did not (1 ms)
  place
    throws an error
      ✓ when coordinates are out of bounds (70 ms)
      ✓ when horizontal ship is placed too far right (2 ms)
      ✓ when vertical ship is placed too far down (3 ms)
      ✓ when ship is placed on top of existing ship's head (29 ms)
      ✓ when ship is placed on top of existing ship's body (4 ms)
      ✓ when ship is placed on top of existing ship's tail (3 ms)
      ✓ when horizontal ship is placed directly above existing ship (7 ms)
      ✓ when horizontal ship is placed directly below existing ship (5 ms)
      ✓ when horizontal ship is placed directly left to existing ship (7 ms)
      ✓ when horizontal ship is placed directly right to existing ship (5 ms)
      ✓ when vertical ship is placed directly above existing ship (5 ms)
      ✓ when vertical ship is placed directly below existing ship (5 ms)
      ✓ when vertical ship is placed directly left to existing ship (13 ms)
      ✓ when vertical ship is placed directly right to existing ship (6 ms)
      ✓ when ship is placed into diagonal neighborhood of existing ship (6 ms)
    does not throw
      ✓ when horizontal ship is placed just on the edge (4 ms)
      ✓ when vertical ship is placed just on the edge (1 ms)
      ✓ when ship is placed in top left corner (1 ms)
      ✓ when ship is placed in top right corner (3 ms)
      ✓ when ship is placed in bottom left corner (2 ms)
      ✓ when ship is placed in bottom right corner (1 ms)
  getState
    throws an error
      ✓ when coordinates are out of bounds (17 ms)
    returns fog
      ✓ when nothing has been attacked yet (2 ms)
      ✓ when coordinate has not been attacked (1 ms)
    returns water
      ✓ if coordinate was attacked before and there is no ship there (1 ms)
    returns hit
      ✓ if coordinate was attacked before and there is a ship there
    returns sunk
      ✓ if coordinate was attacked before and there is a sunken ship there (1 ms)
  attack
    throws an error
      ✓ when given invalid coordinates (2 ms)
      ✓ when given coordinate already received an attack (13 ms)
    does not throw
      ✓ when clearing a ship on the side of the board (8 ms)
    clears surrounding water
      ✓ when ship is sunk (6 ms)

Test Suites: 3 passed, 3 total
Tests:       52 passed, 52 total
```

## Backlog
- Configurable placement rules:
    - Fleet selection
    - Disable enforced gap
