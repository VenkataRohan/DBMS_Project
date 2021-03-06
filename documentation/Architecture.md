
## FRONT END DESIGN: 

### Pages in front end: 

**Login**: This page allows the user to get into the parent's portal by entering the valid roll no and password of each student. This also contains login access for staff. 
  
**Home**: This page displays the details of the student and logout option is also provided. It also contains the buttons for attendance, courses picked, grades, list of holidays and complaints if any to be registered by the parents. 

**Attendance**: This page displays the attendance of student for the classes. 
 
**Grades**: This page displays the grades in each course taken. 

**List of holidays**: This page displays all the holidays reserved for the current semester. 

**Complaints registered**: This page allows the parents to lodge complaints if any. 


## BACKEND DESIGN:

These routes are created by using express.js 

**/Login(post)**    
Requests the login id and password it checks whether the login credentials are correct from the database and renders the home page as a response. 

**/Home (get)**     
Renders a page that contains navigation buttons like attandance,grades,signout. 

**/Attendance(get)**    
Renders a page that contains the attendance  percentage of each course of the semester selected. 

**/Grades(get)**    
Renders a page that contains the grade of each course of the semester selected. 

**/forgot_password(get)**
takes otp,new password and checks wheather the enter data is valid and renders marks.html 


## DATABASE DESIGN: 

### Tables

**1.Student**:   
Student_id  
Password                      
Student_name  
Fathers_name  
Branch   
Yjoin  
Dob  
Email_id
gender

 
**2.Course**:   
Course_id  
Course_name  
Branch_name  
Sem_no  
Credits  


**3.Branch tables for each branch (4  branches 4 tables)**:    
Course_id                                                                                                             
Rollno1_grade                      
Rollno1_Attendance                 
Rollno2_grade                 
Rollno2_Attendance                    
Rollno3_grade              
Rollno3_Attendance                    
.
.
.

**4.List of holidays**:
 id
 date
 holiday
 
 **5.staff**:
 id
 password
 
 **6.complaints**:
 no
 student id
 complaint
 completed
 

## Overview

![overview](https://user-images.githubusercontent.com/89983494/139715216-e3979857-21e4-4dcd-a2f7-6c0fb456a035.jpg)

## E-R Diagram
![E-R Diagram](https://user-images.githubusercontent.com/71220310/146066861-c58efdd3-5920-40ec-8144-37bb88c03a8d.jpeg)

