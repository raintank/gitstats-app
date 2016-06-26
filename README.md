gitStats is a plugin for Grafana that configures tasks to periodically collect Github repository stats available via the Github API.  The collection tasks and metrics collected are stored in the Cloud using the SaaS services provided through Grafana.net.

# Requirements
The Gitstats app requires a Grafana.net account, [Grafana 3.0](https://grafana.org) (or higher) and a [Github personal access token](https://github.com/settings/tokens). 

## Usage:
Once the app is enabled in grafana, simply navigate to the "Add Task" page.  Enter an valid Github Access token and set the user and repo to start collecting data for.  If the user field is left blank, the user who owns the Access Token will be used. If the repo field is left blank, metrics will be collected for all repositories owned by the user.

# Metrics collected
The following metrics are available via the Github API and are collected.
## Repository Metrics
- forks:  Number of active forks of the repository.
- issues: number of open issues for the repository.
- network: number of  members in the repository network.
- stars: number of stars the repository has.
- subscribers: number of poeple subscribed to the repository.
- watches: alias for stars.
- size: the size of the repository in KB.

## User metrics
- public_repos: number of public repositories owned by the user.
- public_gists: number of public gists owned by the user
- followers: number of people following the user
- following: number of other users the user is following.
- private_repos: number of private repos.
- private_gists: number of private gists.

### Support
- Join our public slack channel; sign up at [http://slack.raintank.io](http://slack.raintank.io).
- Email [support@raintank.io](mailto:support@raintank.io).

------

#### Changelog

##### v1.0.1
- Initial Release
