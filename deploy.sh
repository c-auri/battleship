#!/bin/bash

# just to get us all at the same starting point
git checkout main

# delete your build folder
rm -rf dist/

# prune worktree that might have been
# deleted in the previous command
git worktree prune

# create a 'build' directory checked out to the gh-pages branch
git worktree add -B gh-pages dist origin/gh-pages

# build the project
npm run build

# cd into 'build' folder, which is now on the gh-pages branch
cd dist

# fail if for some reason this isn't the gh-pages branch
current_branch=$(git symbolic-ref --short -q HEAD)
if [ "$current_branch" != "gh-pages" ]; then
  echo "Expected build folder to be on gh-pages branch."
  exit 1
fi

# commit and push to gh-pages
# use the provided argument as commit message,
# or use a default if not provided
MSG=${1:-"Update gh-pages"}
git add . && git commit -m "$MSG"
git push