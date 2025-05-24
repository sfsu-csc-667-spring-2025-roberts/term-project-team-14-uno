[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=18683937)

# Team 14 Uno App!

Team 14: Miles Young, Juan Segura Rico, Chance Vodnoy, Ani Das

A couple details for tester...For testing the application we often would disable the session and auth middleware due to the fact that it uses cookies which makes testing game features inconvenient. While everything regarding sessions was tested and works, it may be easier for those attempting to test the functionality of the game to use our technique of mocking sessions. Simply search "this is for testing" in a project wide search and uncomment the lines to enable this (also comment out the auth middleware as this will prevent use of the site without sessions).

All API code is organized in the roots folder, sessions and socketsa in their respective folders. The game folder on the server is for all classes pertaining to management of the game state although some of the files were moved into the client folder for use on both front and back end.
