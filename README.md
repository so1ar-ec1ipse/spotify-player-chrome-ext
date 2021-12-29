# Spotify Player (Chrome Extension)

![App Screenshot](https://i.ibb.co/P5N8ZvF/first-image.png)

#### Video Demo: https://youtu.be/5L9FiSDhfAA

## Description

Spotify Player is a chrome extension used for controlling your spotify music. This mini-controller can be used with the [Spotify web player](https://open.spotify.com/), Spotify desktop app as well as Spotify on your mobile. As long as you have authorized your Spotify account with this extension and have the Spotify app open in the background.

### What can this extension do?
- You can Play/Stop tracks.
- You can Skip/Shuffle/Repeat tracks.
- You can Save(Like) tracks.
- You can Change Volume.
- You can Seek Forward/Backward 15 seconds when listening to podcasts.

### What can this extension NOT do?
- You can NOT seek to a specific position in a track.
- You can NOT search/browse for tracks.
- You can NOT create or save tracks to playlists.
- It can NOT access your personal information linked to your Spotify account.
- It is NOT a replacement for the Spotify app, it's supposed to be used together.

## Use cases

This extension is for people with lots of chrome tabs open at the same time (like me). It's convenient to click on the Spotify Player popup to manage your music instead of opening the Spotify app and doing it there. For some people this might just take longer time because they have an extra monitor with the Spotify interface open there. But for other people (like me) it can save you a couple of milliseconds, or perhaps even seconds of time spent moving your mouse to the Spotify app to get a big clunky interface just to stop a track.

## Under the Hood

Under the hood this extension is using the [Spotify Web API](https://developer.spotify.com/documentation/web-api/) for it to take actions on your behalf. It is used for you to authorize your Spotify account with this extension, thus giving it permission to do the following tasks mentioned above.

## Technologies

- HTML for markup.
- CSS for the ui.
- JavaScript for logic & interactions.
