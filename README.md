# Chat App
This React Native application enables users to chat, share various media and their location, and take pictures on-and-offline. The Chat App is supported on both Andriod and iOS devices.

## **Technologies**

- React Native
- JavaScript
- Expo
- Google Firestore
- Google Firebase authentication
- Google Firebase cloud storage

## User Stories

### 1. User Page Customization  
**As a** new user,  
**I should be able to** easily enter a chat room  
**So that** I can quickly start talking to my friends and family.

```gherkin
Feature: User Page Customization
  Scenario: User should be able to enter their name
    Given the user is on the Start page;
    When the user opens the application;
    Then the user should see an input field for their name.
```  

```gherkin
Feature: User Page Customization
  Scenario: User should be able to select their background color
    Given the user is on the Start page;
    When the user opens the application;
    Then the user should see four options for their background color selection.
```  


### 2. Chat Page Messaging Capabilities
**As a** user,  
**I should be able to** send messages to my friends and family members  
**So that** I can exchange the latest news.

```gherkin
Feature: Chat Page Messaging Capabilities
  Scenario: User should be able to send and receive messages
    Given the user is on the Chat page;
    When the user views the screen;
    Then the user should see messages from themselves and their recipients.
``` 


### 3. Sending Messages and Sharing Location  
**As a** user,  
**I should be able to** send images to my friends  
**So that** I can show them what I’m currently doing.




### 4. Online and Offline Data Storage  
**As a** user,  
**I should be able to** share my location with my friends   
**So that** I can show them where I am.




### 5. Online and Offline Data Storage  
**As a** user,  
**I should be able to** read my messages offline   
**So that** I can reread conversations at any time.



### 6. Online and Offline Data Storage  
**As a** user with a visual impairment,  
**I should be able to** use a chat app that is compatible with a screen reader   
**So that** I can engage with a chat interface.








