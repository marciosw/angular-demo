// Copyright 2016-2020, Pulumi Corporation.  All rights reserved.

import * as docker from "@pulumi/docker";
import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";

// Location to deploy Cloud Run services
const location = gcp.config.region || "us-central1";

// -------------------------------------- //
// Deploy a custom container to Cloud Run //
// -------------------------------------- //

// Build a Docker image from our sample Ruby app and put it to Google Container Registry.
// Note: Run `gcloud auth configure-docker` in your command line to configure auth to GCR.

const imageName = "tutorial";
const myImage = new docker.Image(imageName, {
    imageName: pulumi.interpolate`gcr.io/${gcp.config.project}/${imageName}:latest`,
    build: {
        context: "./angular-demo",
        platform: "linux/amd64",

    },
});

// Deploy to Cloud Run. Some extra parameters like concurrency and memory are set for illustration purpose.
const angularService = new gcp.cloudrun.Service("angular", {
    location,
    template: {
        spec: {
            containers: [{
                image: myImage.imageName,
                resources: {
                    limits: {
                        memory: "1Gi",
                    },
                },
            }],
            containerConcurrency: 50,
        },
    },
});

// Open the service to public unrestricted access
const iamAgular = new gcp.cloudrun.IamMember("angular", {
    service: angularService.name,
    location,
    role: "roles/run.invoker",
    member: "allUsers",
});

// Export the URL
export const angularUrl = angularService.statuses[0].url;
