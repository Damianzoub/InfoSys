# Git Basics

`Why We Need Version Control`

## The Problem

Imagine you're working on your machine learning project for the research team. You've spent weeks perfecting your neural network architecture, and it's finally working! But then you think: "What if I try this new activation function?"

So you make changes... and suddenly nothing works. You try to undo your changes, but you can't remember exactly what you modified. You panic and think: "I should have made a backup!"

This scenario gets even worse when working in a team:

- **Maria** is working on the data preprocessing pipeline
- **John** is implementing the model architecture
- **You** are working on hyperparameter tuning

What happens if:

- two people modify the same file?
- if someone's code breaks the entire project?

## The Solution

**Git** is like having a time machine and a collaborative workspace for your code. Think of it as:

### 1. A Time Machine for Your Code

Git automatically creates "snapshots" (called **commits**) of your project at different points in time. You can:

- Go back to any **previous version**
- See exactly **what changed** between versions
- Experiment fearlessly, knowing you can always **return to a working state**

### 2. A Collaboration tool

Git helps teams work together by:

- Merging everyone's contributions automatically
- Tracking who made what changes and when
- Preventing conflicts and data loss
- Allowing parallel development without stepping on each other's toes

### 3. A Backup System

Your code is stored in multiple places:

- On your computer (local repository)
- On GitHub (remote repository)
- On your teammates' computers

## What is a Repository?

A **repository** (or "repo" for short) is like a project folder that Git manages. It contains:

- **All your project files** (code, documentation, configs, etc.)
- **Complete history** of all changes ever made
- **Metadata** about who made changes and when
- **Branches** for parallel development

`Think of a repository as a smart project folder that remembers everything that has ever happened to your project.`

### Types of Repositories

**Local Repository**: The copy on your **computer**

- Where you do your actual work
- Contains all project history
- Can work offline

**Remote Repository**: The copy on **GitHub/GitLab**

- Shared with your team
- Acts as backup and collaboration hub
- Usually considered the "official" version

## Example: AI Research Team Workflow

Let's say our team is building a computer vision model for medical imaging:

1. **Week 1**: You create the initial project structure and upload it to GitHub
2. **Week 2**: Maria adds data loading code, Mike adds the CNN model
3. **Week 3**: John discovers a bug in the data loader and fixes it
4. **Week 4**: You want to experiment with a new loss function

With Git:

- Each person works on their own files
- Changes are tracked and attributed to the right person
- You can experiment with the new loss function without breaking the main code
  - If your experiment works, it can be easily integrated
  - If it doesn't work, you can discard it without affecting anyone else

CREDITS TO: https://github.com/steliosgrs
