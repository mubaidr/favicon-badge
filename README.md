# Favicon Badger

`favicon-badger` is a simple yet powerful JavaScript library that allows you to dynamically modify the favicon of a webpage by adding badges such as unread counts or notification icons.

## Installation

You can install `favicon-badger` via npm:

```bash
npm install favicon-badger
```

## Features

- Dynamically update the favicon with numerical badges for unread counts or notifications.
- Customize badge background color, text color, size, position, and font.
- Works with any existing favicon image.
- Lightweight and easy to integrate into any web application.
- Provides a `clearBadge` function to remove the badge and revert to the original favicon.

## Usage

### Setting a Badge

To set a badge on your favicon, use the `setBadge` function:

```javascript
import { setBadge } from "favicon-badger";

// Set a simple badge with count 5
setBadge(5);

// Set a badge with custom options
setBadge(10, {
  backgroundColor: "#007bff", // Blue background
  textColor: "#ffffff", // White text
  radius: 10, // Larger badge
  x: 20, // Position further right
  y: 20, // Position further down
  font: "bold 12px sans-serif", // Custom font
});
```

### Clearing a Badge

To clear the badge and revert to the original favicon, use the `clearBadge` function:

```javascript
import { clearBadge } from "favicon-badger";

clearBadge();
```

## API

### `setBadge(count: number, options?: BadgeOptions)`

Sets a numerical badge on the favicon.

- `count`: The number to display in the badge.
- `options`: (Optional) An object to customize the badge's appearance.

`BadgeOptions` interface:

```typescript
interface BadgeOptions {
  backgroundColor?: string; // Default: '#FF0000' (Red)
  textColor?: string; // Default: '#FFFFFF' (White)
  radius?: number; // Default: 8
  x?: number; // Default: 16 (x-coordinate of the badge center)
  y?: number; // Default: 16 (y-coordinate of the badge center)
  font?: string; // Default: '10px Arial'
}
```

### `clearBadge()`

Clears any active badge and attempts to revert the favicon to its original state.

## Contributing

We welcome contributions to `favicon-badger`! To contribute, please follow these steps:

1.  **Fork the repository.**
2.  **Clone your forked repository** to your local machine.
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b feature/your-feature-name
    ```
    or
    ```bash
    git checkout -b bugfix/your-bug-fix-name
    ```
5.  **Make your changes.** Ensure your code adheres to the existing style and conventions.
6.  **Write tests** for your changes, if applicable.
7.  **Run tests** to ensure everything is working correctly:
    ```bash
    npm test
    ```
8.  **Build the project** to verify compilation:
    ```bash
    npm run build
    ```
9.  **Commit your changes** with a clear and concise commit message.
10. **Push your branch** to your forked repository.
11. **Open a Pull Request** to the `main` branch of the original repository.

Thank you for your contributions!
