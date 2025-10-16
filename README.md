# B-Tree Visualization – SIWANSH PATHAK (080BCT083)

[Live Demo](https://siwanshh.github.io/Btree-by-080bct083/)

---

## Overview

A **B-Tree** is a self-balancing search tree that maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic time. It is commonly used in databases and file systems to manage large blocks of data efficiently.  

This project implements a **fully interactive B-Tree visualization** in JavaScript, allowing you to **insert, delete, and observe the structure dynamically**. The visualization is animated, showing how nodes split, merge, and rebalance during operations.

---

## Features

- **Interactive Insert & Delete**
  - Insert keys dynamically and watch the tree grow.
  - Delete keys while maintaining strict B-Tree properties.
  - Proper handling of root changes, merges, and borrows.

- **Dynamic Tree Layout**
  - Nodes automatically reposition for a clear hierarchy.
  - Proper spacing between nodes at the same level.
  - Multi-level support — the tree scales automatically with insertions.

- **Node Animation**
  - Smooth transitions when nodes move, split, or merge.
  - Animated highlighting of operations for better understanding.

- **Color-Coded Levels**
  - Each level has a distinct color to visually distinguish hierarchy.
  - Supports up to 6 unique colors with automatic cycling for deeper levels.

- **Statistics Display**
  - Live node count and tree height updates.
  - Helps understand how the B-Tree grows with operations.

- **Audio Feedback**
  - Sound effects for insert, split, and delete operations.
  - Enhances interactivity and makes visualization engaging.

- **Responsive Canvas**
  - Tree visualization adjusts dynamically to window size.
  - Works seamlessly on different screen sizes.

- **Dark/Light Mode Toggle**
  - Switch between dark and light themes while preserving visual clarity.

---

## How It Works

- **Insertion**: Follows standard B-Tree insertion rules with node splitting.  
- **Deletion**: Properly handles leaf and internal nodes, borrowing from siblings or merging when necessary. Ensures all B-Tree properties are maintained.  
- **Traversal**: Tree is traversed for rendering, and layout is recalculated after each operation.  
- **Visualization**: Nodes are drawn as rounded rectangles with keys, and lines connect parents to children.

---

## Demo

Check out the live interactive demo here: [https://siwanshh.github.io/Btree-by-080bct083/](https://siwanshh.github.io/Btree-by-080bct083/)

---

## Usage

1. Open the project in a browser.
2. Enter the **degree** of the B-Tree (order).
3. Use the input box to **insert** or **delete** keys.
4. Toggle **light/dark mode** as preferred.
5. Observe the animated tree update in real-time.

---

## Technologies

- **JavaScript** – core B-Tree implementation and animations  
- **HTML5 Canvas** – tree rendering and animations  
- **CSS** – responsive layout and themes  
- **Audio** – feedback for operations  

---

## Author

**Siwansh Pathak (080BCT083)**  
B-Tree visualization project for educational purposes and interactive learning.
