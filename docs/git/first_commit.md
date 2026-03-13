# Git Core Concepts

`Save, Track, Commit, Push, Pull`

Understanding these five core concepts will make Git much clearer. Let's think of them as different stages in the life of your code changes.

## 1. Save a File

**What it is**: This is just your normal "Ctrl+S" - saving changes to a file on your computer.

**Example**: You modify your `model.py` file to add a new layer to your neural network and hit save.

**What happens**:

- The file is updated on your local disk
- **BUT Git doesn't know about these changes yet**
- Your changes exist only on your computer!

Think of this as **editing a draft** - you've made changes, but they're not yet "official."

## 2. Track (Staging Changes)

**Command**: `git add <filename>` or `git add .`

**What it is**: Telling Git "Hey, I want you to track that file!"

**Example**: After modifying `model.py`, you run:

```bash
git add model.py
```

**What happens**:

- Git prepares to include your changes in the next "snapshot"
- Changes are moved to the "staging area"
- Multiple files can be staged before committing

**Why this step exists**:

- You might have changed 5 files but only want to save 2 of them
- Allows you to group related changes together
- Gives you control over what gets recorded

Think of this as **selecting which photos to put in your album** - you've taken many photos, but you choose which ones to include.

## 3. Commit (Create a Snapshot)

**Command**: `git commit -m "Your message describing what you changed"`

**What it is**: Creating an official "snapshot" of your project at this moment in time.

**Example**:

```bash
git commit -m "Add dropout layer to prevent overfitting"
```

**What happens**:

- Git creates a permanent record of all staged changes
- Each commit gets a unique ID (like a timestamp)
- You provide a message explaining what you changed and why

**Best Practices for Commit Messages**:

- Be specific: "Fix data loading bug" not "Fix bug"
- Use present tense: "Add feature" not "Added feature"

Think of this as **taking an official photo for your album** with a caption - it's now part of your permanent record.

## 4. Push (Upload to Remote)

**Command**: `git push origin main`

**What it is**: Uploading your commits to GitHub (or another remote server).

**Example**: After making several commits locally, you run:

```bash
git push origin main
```

**What happens**:

- Your local commits are uploaded to GitHub
- Your teammates can now see your changes
- Your work is backed up in the cloud
- Others can download and build upon your work

Think of this as **publishing your album online** - now everyone can see your photos and add their own.

## 5. Pull (Download Changes)

**Command**: `git pull origin main`

**What it is**: Downloading and integrating changes that others have made.

**Example**: Sarah has uploaded new data preprocessing code. You run:

```bash
git pull origin main
```

**What happens**:

- Git downloads Sarah's commits from GitHub
- Your local repository is updated with her changes
- You now have the latest version of the project

**When to pull**:

- Before starting new work (to get the latest version)
- When you see that teammates have made changes
- Before pushing your own changes (to avoid conflicts)

Think of this as **updating your album with everyone else's new photos**.

## The Complete Workflow

Here's how these concepts work together in a typical day:

```bash
# 1. Get the latest version
git pull origin main

# 2. Make changes to your files and save them
# Edit model.py, data_loader.py, etc.

# 3. See what you've changed
git status

# 4. Stage the changes you want to commit
git add model.py data_loader.py

# 5. Create a commit
git commit -m "Improve model architecture and fix data loading"

# 6. Upload to GitHub
git push origin main
```

### Visual Representation

```
Your Computer                          GitHub (Remote)
┌─────────────┐                       ┌─────────────┐
│   Working   │  save   ┌─staging─┐   │   Remote    │
│   Directory ├────────▶│  Area   │   │ Repository  │
│             │         └─────────┘   │             │
│             │         commit│       │             │
│             │               ▼       │             │
│             │         ┌──────────┐  │             │
│             │         │  Local   │  │             │
│             │         │Repository│  │             │
│             │         └─────┬────┘  │             │
│             │               │push   │             │
│             │               ├──────▶│             │
│             │               │       │             │
│             │               │pull   │             │
│             │               ◀───────┤             │
└─────────────┘                       └─────────────┘
```

## Common Beginner Mistakes

1. **Forgetting to pull first**: Always `git pull` before starting work
2. **Not staging changes**: Remember to `git add` before committing
3. **Vague commit messages**: "Updated stuff" tells you nothing later
4. **Not pushing regularly**: Push daily to backup your work (not every week!)

## Quick Reference

Remember: **Save → Track → Commit → Push** for your changes, and **Pull** to get others' changes!

| Action              | Command                   | What it does                 |
| ------------------- | ------------------------- | ---------------------------- |
| Check status        | `git status`              | See what files have changed  |
| Stage files         | `git add .`               | Stage all changed files      |
| Stage specific file | `git add filename.py`     | Stage one specific file      |
| Commit              | `git commit -m "message"` | Create snapshot with message |
| Push                | `git push origin main`    | Upload commits to GitHub     |
| Pull                | `git pull`                | Download latest changes      |
