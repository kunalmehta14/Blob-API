## Image Blob API Service

> This project is a Node.js and TypeScript application called Image Blob API Service. It serves as a REST API endpoint for image files stored on local storage. 
>
> These REST endpoints are utilized by a [MySQL server](https://github.com/kunalmehta14/RealEstate-DataPipeline/tree/main/db_documentation) to store the location of the images, which are then loaded when queried by the [Django REST API](https://github.com/kunalmehta14/RealEstate-DataAPI).

### Technologies Used

+ Node.js
+ TypeScript
+ Express.js
+ Docker
+ Docker Compose
+ Jenkins

### Features

+ Provides REST API endpoints for accessing image files stored locally.
+ Configured to log session details and errors, with logs sent to Docker stdout.
+ Packaged as a Docker container using Docker Compose for easy deployment and scalability.
+ Includes Jenkins file for continuous integration and continuous deployment (CI/CD) purposes.

### Usage

To utilize this application for your own project, use the following steps to get it up and running:

+ [Install Docker](https://github.com/kunalmehta14/scripts-for-systems-admin/blob/master/Linux/docker-management.md#install-docker-daemon), skip this step if you have docker installed already.
+ Clone this repository to your local machine:<br>
````
git clone https://github.com/kunalmehta14/Blob-API.git
cd Blob-API
````
+ Build and start the Docker container using Docker Compose:
````
docker compose up -d
````
+ Wait for the service.

Note: The Blob-API docker container is configured to send all the crawler functions related logs to Docker stdout. 
Docker management related documentation can be found here: ['Docker Management'](https://github.com/kunalmehta14/scripts-for-systems-admin/blob/master/Linux/docker-management.md 'Docker Management')

### REST API Endpoints
+ /images/:id: GET - Retrieves a list of available image filenames.
+ /images/:id/:filename: GET - Retrieves a specific image by filename.

### BLOB STORAGE API ARCHITECTURE
![Architecture](BlobStorage-API-Architecture.svg)

### Jenkins CI/CD Pipeline

The repository includes a Jenkinsfile that defines the CI/CD pipeline:
<ol>
<li> SCM checkout is triggered when the code is pushed to the master branch.
<li> Jenkins instance clones the repository content.
<li> It creates a Docker image.
<li> The Docker image is uploaded to Docker Hub.
<li> The updated image is deployed as a container instance on production servers.
</ol>