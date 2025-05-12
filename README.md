Clone this project and go to the working directory where cloned

git clone https://github.com/mahekag/Bigbasket-Payment-Automation.git

cd Bigbasket-Payment-Automation

Run these commands to install the plugin and cypress

npm install -D cypress-iframe

npm install cypress --save-dev


Open cypress using 
npx cypress open

Run the script

Login is done via cookies, if no file exists in cypress/cookies, you have to login once and then the cookies would be saved.
For first time login, you have to delete the file in cypress/cookies so that you can login using your number by changing it into code.
Manually have to enter payment otp. After automatic submit button, the page reloads but the money is added successfully.
