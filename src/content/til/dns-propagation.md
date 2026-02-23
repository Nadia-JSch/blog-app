---
title: "Deploy an Astro app"
date: "2026-02-23"
description: "Deploying an Astro app with Cloudflare pages is pretty quick unless you have a new domain"
tags: ["devops"]
---

The process of buying a domain and hosting an Astro app on Cloudflare pages then deploying is fairly straightforward.

But after buying a domain and changing nameserver control, you don't get to see your blog live immediately but have to wait for the Domain Name System (DNS) to propagate globally. 

## Buy a domain

After paying for the domain, you get an email from the South African Registry Consortium immediately. This step is exciting.

## Sign up for Cloudflare

Cloudflare is generous with its free tier hosting! Sign up for an account and wonder what to do next with all those sidebar options. 

## Build the app on Cloudflare

Go to the **Workers & Pages** page and create a new Page. Choose the option to connect your GitHub account and fetch all your repos. 

Select the repo to deploy and provide the build command. Cloudflare gets to work building the app and you can see the output in case anything needs debugging. 

Cloudflare gives you a URL where you can preview the site that's built, like `https://blog-app-23h.pages.dev/`

## Add a custom domain

Add the domain you just bought to the new Page.

### Copy the Cloudflare nameservers to registrar

Give control of the DNS to Cloudflare because they are really reliable. They are weird-looking server names, like `amira.ns.cloudflare.com`. Replace the registrar's nameserver values with Cloudflare's and save.

### Wait for DNS propagation

The entire internet needs to refresh its DNS records to include your new domain and nameserver control changes. I waited for a couple of hours but reportedly this can take up to a couple of days, so stop refreshing the [DNS Check site](https://dnschecker.org/) and do something else. The Cloudflare settings indicate when the propagation is done.

## The app is live

Hosting using GitHub and Cloudflare means any changes pushed to the `main` branch trigger the build and deploy process, which is super convenient.

## CNAME and A DNS records

The Canonical NAME (CNAME) is a record that maps a hostname to another hostname. Cloudflare maps `pgofcode.co.za` to the hostname they give you (like `blog-app-23h.pages.dev/`). Turns out it's not just a preview URL, but the canonical address Cloudflare gives you. The URL `pgofcode.co.za` is like an alias to the underlying host URL.

Technically, Cloudflare is doing some complicated behind-the-scenes work in a process called CNAME flattening, which involves an IP address or something, instead of creating a CNAME record, but it's interesting to learn there are more mapping types.

In contrast, an A record maps a human-readable domain to an IP address. That is the typical relationship that comes to mind, but it's not the only type.