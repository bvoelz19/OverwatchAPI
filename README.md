# OverwatchAPI
#### Brendan Voelz


### Purpose
This application functions as a RESTful API for serving Overwatch player data upon request. User has the ability to query data for **any** player on any of the three consoles: PC, PlayStation, and Xbox.

### Usage
User can make an HTTP GET request to:  
https://overwatchapi.herokuapp.com/query?platform=YOUR_PLATFORM&username=YOUR_USERNAME  
Note that **username is case-sensitive** when making your calls to the API. 

### Going forward
The next step for this project will be to build the front-end side of the application to give users a GUI to view their own player data in a more aesthetically pleasing way.