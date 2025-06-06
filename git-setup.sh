# Initialize Git repository for deployment
git init
git add .
git commit -m "🚀 Initial commit - Undhyu.com ready for deployment"

# Create .gitignore for sensitive files
echo "node_modules/" >> .gitignore
echo "__pycache__/" >> .gitignore
echo ".env" >> .gitignore
echo "*.log" >> .gitignore

# Ready for GitHub deployment