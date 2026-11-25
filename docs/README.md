# SL-LMS documentation

| Document                                         | What it covers                                                   |
| ------------------------------------------------ | ---------------------------------------------------------------- |
| [QUICKSTART.md](QUICKSTART.md)                   | Getting the application running and finding your way around it   |
| [ENVIRONMENT.md](ENVIRONMENT.md)                 | Every environment variable, and what happens when one is missing |
| [CONTRIBUTING.md](CONTRIBUTING.md)               | Branching, the pull request gate, lint and formatting            |
| [AUTH_SYSTEM_DOCS.md](AUTH_SYSTEM_DOCS.md)       | The authentication context, token storage and session handling   |
| [ROUTING_SECURITY.md](ROUTING_SECURITY.md)       | Route guards, role routing and what they do and do not protect   |
| [SECURITY_GUIDELINES.md](SECURITY_GUIDELINES.md) | Standing security rules for the codebase                         |

The four documents above `ENVIRONMENT.md` in that list describe the frontend as
built and were written against it; `main` is the authority where they
disagree with the code.

## A note on the route guards

`ROUTING_SECURITY.md` describes the client-side guards. They shape navigation;
they are not what protects data. Authorisation is decided on the server for
every request, and ownership is re-checked per resource rather than per route.
