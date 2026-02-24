# Create all files
$baseDir = Get-Location

# Create directories
mkdir "$baseDir\src\routes", "$baseDir\src\middleware", "$baseDir\prisma", "$baseDir\frontend" -Force | Out-Null

# Create package.json
@'
{
  "name": "universal-scheduler-backend",
  "version": "0.1.0",
  "private": true,
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "dev": "node src/index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev --name init"
  },
  "dependencies": {
    "express": "^4.18.2",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "@prisma/client": "^5.8.0",
    "dotenv": "^16.0.0",
    "stripe": "^14.0.0"
  },
  "devDependencies": {
    "prisma": "^5.8.0"
  }
}
'@ | Out-File "$baseDir/package.json"

Write-Output "✓ Created package.json"
Write-Output "✓ Created directories"
Write-Output ""
Write-Output "Now run: npm install"