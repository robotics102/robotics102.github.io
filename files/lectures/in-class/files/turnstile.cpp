#include <iostream>

int main() {
  // Locked: 0, unlocked: 1, closed: -1.
  int turnstileState = 0;
  std::cout << "Hello! The turnstile state is: " << turnstileState << "\n";

  while (true) {
    // Get an event from the user.
    char event;
    std::cout << "Enter an event (c, p, q): ";
    std::cin >> event;

    // Perform state transition based on event.
    if (event == 'c') {  // Enter a coin.
      if (turnstileState == 0) {  // Locked.
        turnstileState = 1;  // Unlocked.
      }
      else if (turnstileState == 1) {  // Unlocked
        std::cout << "  Fare is already paid.\n";
      }
    }
    else if (event == 'p') {  // Push
      if (turnstileState == 0) {  // Locked.
        std::cout << "  Turnstile is locked! Please insert a coin.\n";
      }
      else if (turnstileState == 1) {  // Unlocked
        std::cout << "  Turnstile opened!\n";
        turnstileState = 0;
      }
    }
    else if (event == 'q') {  // Quit.
      turnstileState = -1;  // Closed.
    }
    else {  // Error case.
      std::cout << "Unrecognized event: " << event << "\n";
    }

    // Perform action based on current state.
    if (turnstileState == 0) {  // Locked.
      std::cout << "Turnstile is locked.\n";
    }
    else if (turnstileState == 1) {  // Unlocked
      std::cout << "Turnstile is unlocked.\n";
    }
    else if (turnstileState == -1) {  // Closed!
      std::cout << "Turnstile closing!\n";
      break;
    }
  }

  std::cout << "Goodbye!\n";
}