<img src="https://github.com/timo-cmd/nelmo/blob/master/images/nelmologo.jpg"></img>
---


A polished implementation of the Elm language in JavaScript

![](https://img.shields.io/badge/build-passing-brightgreen)
![](https://img.shields.io/badge/circleci-passing-brightgreen)
![](https://img.shields.io/badge/chat-on%20googleGroups-dodgerblue)
![](https://img.shields.io/badge/Self--host-passing-dodgerblue)

Nelmo is a language with the following goals:
* Virtual Machine
  * JIT compilation
  * Small but compact byte-code interpreter  
  * small and fast
* Syntax
  * usage in browser
  * Lightweight fibers
  * nil value
* Api
  * strong elm api 
  * Useful rest-api
  

  

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

The Nelmo language is built on top of node.js so simply do install the deps from npm:

```
$ git clone https://github.com/timo-cmd/nelmo
$ cd /nelmo-master && cd samples && cd compile
npm install nelmo
```

### Installing

To keep up with clean deps simply do:

```
npm install && npm init
```
<hr>

### Cli options

To compile your programs use the .elm extension and type this commands in a native shell.

```
$ node compile <yourfile.elm> 
$ node <yourfile>
```


## Running the tests

The test section for Nelmo is written itselfes in Nelmo in interop with JavaScript!

### Nelmo

Run this command in your local shell.

```
npm test
```

---
## Sample programs written in nelmo

```Elm
-- incr.elm --

log = Native.console.log
    incr : Int -> Int
    incr a = a + 1
log "incr 1 is" (incr 1)
```

```Elm
-- hello.elm --

log = Native.console.log
    greet = "Hello, from Nelmo!"
log greet
```

Pretty polished and elegant right... Yes!

The Nelmo compiler can run anywhere where Elm or JavaScript can run !

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://github.com/timo-cmd/nelmo/contributing.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Timo Sarkar**  - [Nelmo](https://github.com/timo-cmd/nelmo/README.md)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

Domo arigato!

Happy Coding!




