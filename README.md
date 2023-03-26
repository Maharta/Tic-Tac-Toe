# Tic-Tac-Toe

This is a project assigned by TheOdinProject. There is an extra optional challenge issued, which is to implement an unbeatable AI using the minimax algorithm. I managed to implement the impossible AI using the minimax algorithm, and i learned a lot.

Also, i used dependency inversion concept (implemented with dependency injection) to loosely couple some object, such as the viewController and the gameBoard.

## Dependency Inversion

In the implementation of the gameBoard object, the viewController dependency is injected from the outside, meaning that we could change it easily, as long as the new viewController object has the same functionality as the old object. This could be implemented safely with an interface, which is not available in javascript. Because of that, changing the dependency should be done carefully, by looking at the functionality that the current viewController has.

This would be very easy to implement in typescript with interfaces.

## Deployed Project

<https://maharta.github.io/Tic-Tac-Toe/>
