<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://github.com/phuthien007/Waiting-Queue/blob/master/client/public/resources/images/tf-logo.jpg" alt="Project logo"></a>
</p>

<h3 align="center">Waiting Queue project</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/phuthien007/Waiting-Queue/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> 
A project make save time when you wainting many services
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

Includes two project about client and api.
Client is writing by ReactJs.
Api is writing by NestJs

## 🏁 Getting Started <a name = "getting_started"></a>

```mermaid

sequenceDiagram

    title Hiển thị QRCode trên WebClient của POC

    participant WebClientPOC

    participant WebAPI

    WebClientPOC->>WebAPI: /api/queues/{queueCode}/qrcode

    WebAPI->>WebClientPOC: URL của QRcode

    Note right of WebClientPOC: GET với bộ (randomCode, expireddate, hash)

    WebClientPOC-->>WebClientPOC: renđer QRCode

```

```mermaid

sequenceDiagram

    title EndUser đăng kí thứ tự trong Queue

    participant WebEndUser

    participant WebAPI

    WebEndUser->>WebEndUser: get URL from QRCode

    WebEndUser->>WebEndUser: parse QRCode URL

    Note right of WebEndUser: GET với bộ (randomCode, expireddate, hash)

    WebEndUser->>WebAPI: /api/enroll-queues

    Note right of WebAPI: POST với bộ (randomCode, expireddate, hash)

    WebAPI->>WebAPI: Validate

    WebAPI->>WebEndUser: res

```

```mermaid

  graph TD;

      Client[Client GetEnrollQueue]-->Server1;

      Server1[số thứ tự X, và số Y đang phục vụ] --> Client2;

      Client2[Kiểm tra X = Y + 1 => rung]




```

```mermaid

    graph TD;

    subgraph Chuyển trạng thái của Queue phía Server

    Status1[Chờ phục vụ] -- auto --> Status2[Chờ người mới]

    Status2 -- auto --> Status1

    Status1 -- manual --> Status3[Đóng]

    Status2 -- manual --> Status3[Đóng]

    Status3 -- manual --> Status1

    end




    subgraph Chuyển trạng thái của Thứ tự trong Queue của EndUser

        E1[Chờ phục vụ] -- auto --> E2[Đang phục vụ]

        E2 -- auto --> E3[Đã phục vụ]

        E3 -- manual --> E1

    end




```

### Prerequisites

Need:

- NodeJs : >= v16.x, 18.x <br/>
- <p>yarn - Using npm to install yarn:  </p> <pre>$ npm insatll -g yarn</pre>
- <p>Orval - Restful client generator:  </p><pre>$ yarn add global orval </pre>
- Mysql

### Installing

<p> Setup .env from copy .env.example </p>
<ul>
<li>
<h1> 
  Api
</h1>
<pre>
  $ cd api
  $ yarn install
</pre>
<p>
  if you want start dev mode, run: </p>
  
  <pre>
  $ yarn start:dev
  </pre>

<p>
  if you want start prod mode, run: 
  </p>

  <pre>
  $ yarn build 
  $ yarn start:prod
  </pre>

</li>

<li>

<h1> 
  Client
</h1>

<pre>
  $ cd client
  $ yarn install
  $ yarn start
</pre>
</li>
</ul>

## 🚀 Deployment <a name = "deployment"></a>

You can access live website: https://xephang.online

## ⛏️ Built Using <a name = "built_using"></a>

- [MySql](https://www.mysql.com/) - Database
- [NestJs](https://nestjs.com/) - Server Framework
- [ReactJs](https://react.dev/) - Web Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors"></a>

- [@phuthien007](https://github.com/phuthien007) - Idea & Initial work

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- Hat tip to anyone whose code was used
- Inspiration
- References
