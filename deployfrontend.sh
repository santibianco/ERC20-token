rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "Update docs folder for GitHub page"
git push -u origin master
