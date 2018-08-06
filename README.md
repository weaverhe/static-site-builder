# Heather's Static Site Builder

I have put together a really simple static site builder to use for tutorials on my site, and quick personal projects. It's got a gulp build script to run a local server during development & to create deployable build files. I prefer to use Pug, Stylus, ES6, etc. and this makes it all faster.

This is endlessly customizable, whether you prefer SCSS to Stylus or just want some additional styles to pull from on every project. I highly encourage forking, customizing, and uploading for your own future projects.

## Project Tools & Specifications

This project uses gulp to run a development server, and to build the project files for deployment.

Stylus is used for producing CSS, Pug is used as the templating language, and the javascript files use ES6 module imports to compile.

To use these tools:

~~~
npm install
~~~

To run dev server:
~~~
gulp dev
~~~

To build files for deployment:
~~~
gulp build
~~~