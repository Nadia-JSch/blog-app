---
title: "Deploy an Astro app"
date: "2026-02-23"
description: "Deploying an Astro app with Cloudflare pages is pretty quick unless you have a new domain"
tags: ["devops"]
---

Yesterday this blog went live. I learned that after buying a domain and changing nameserver control, you don't get to see your blog live yet but have to wait for the DNS to propagate globally. 

## Buy a domain

After paying for the domain, I got an email from the South African Registry Consortium immediately. This step was exciting.

## Sign up for Cloudflare

Cloudflare is generous with what you can host with its free tier! Sign up for an account and wonder what to do next with all those sidebar options. 

## Build the app on Cloudflare

Go to the **Workloads and Pages** page and create a new Page. There's an option to connect your GitHub account and fetch all your repos. 

Select the repo to deploy and provide the build command. Cloudflare gets to work building the app and you can see the output in case anything needs debugging. 

Cloudflare gives you a URL where you can preview the site that's built, like `https://blog-app-23h.pages.dev/`

## Add a custom domain

Add the domain you just bought to the new Page.

### Copy the Cloudflare nameservers to registrar

Give control of the DNS to Cloudflare because they are really reliable. You get these weird looking names. Replace the registrar's nameserver values with Cloudflare's and save.

### Wait for DNS propagation

The entire internet needs to refresh its DNS records to include your new domain and nameserver control changes. Reportedly this takes a couple of hours, so stop refreshing the [DNS Check site](https://dnschecker.org/) and do something else. The Cloudflare settings will indicate when the propagation is done.

## The app is live

Hosting using GitHub and Cloudflare means any changes pushed to the `main` branch trigger the build and deploy process, which is super convenient.
