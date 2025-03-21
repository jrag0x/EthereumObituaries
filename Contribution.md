# Contributing to Ethereum Obituaries
We appreciate your interest in contributing to the Ethereum Obituaries project. This document outlines how to add a new obituary and how to contribute to the website.

## Part 1: How to Add a New Obituary

### Guidelines for contributing new obituaries
- **Verify the content:** Ensure that the link you want to add explicitly states that the Ethereum project is failing, ending, over, killed, outclassed, dead or that the ETH asset is overtly bearish, going to crash, about to be flippened or going to zero either in the post title or in its contents.

- **Avoid duplicates:** Search previous entries before making a new one to avoid duplicates.

- **One entry per PR:** Add only one new obituary entry per Pull Request.

- **Twitter/X/Social Media posts:** For Twitter posts to be included, the account must have more than 5000 followers at the time of the post.

- **Link validity:** Ensure the provided link is working and points to the original source. Replace it by a screenshot if you fear it might get removed/archived.

### Where to add new obituaries
1. Fork the repository to your GitHub account.
2. Clone your forked repository locally.
3. Create a new branch for your contribution.
4. Locate the `ethereum-obituaries.json` file in the `data`repository.
5. Add a new entry to the JSON file in the following format:
   ```json
   {
     "date": "YYYY-MM-DD",
     "statement": "The exact statement declaring Ethereum's demise",
     "author": "Name of the author",
     "source": "Publication or platform name",
     "link": "URL to the original article or post",
     "archivalLink": "URL to an archived version of the page (e.g., using Wayback Machine or a screenshot hosted on imgur)",
     "isWebpageUp": true,
   }
6. Ensure the entry is in the correct chronological order within the JSON file.
7. Commit your changes and push to your forked repository.
8. Create a Pull Request (PR) to the main repository.

**Or if you are lazy, ping me on X (@Jrag0x), so that I can do it for you.**

## Part 2: Contributing to the Website
We welcome contributions to improve the Ethereum Obituaries website. Here's how you can contribute:

### Setting Up the Development Environment
1. Fork the repository to your GitHub account.
2. Clone your forked repository locally.
3. Ensure you have a modern web browser and a text editor installed.

### Making Changes
1. Create a new branch for your contribution.
2. Make your changes to the relevant files:
   - `index.html` for structure changes
   - `styles/styles.css` for styling changes
   - `scripts/*.js` for functionality changes
3. Test your changes locally by running a server & opening `index.html` in a web browser.

### Types of Contributions
- **Bug Fixes**: If you find a bug, please create an issue describing the problem and then submit a PR with the fix.
- **Feature Enhancements**: For new features, first create an issue to discuss the proposed change before implementing it.
- **Performance Improvements**: Optimizations to make the site faster or more efficient are always welcome.
- **Documentation**: Improvements to README.md, this CONTRIBUTING.md file, or code comments are valuable contributions.

### Submitting Your Changes
1. Commit your changes with a clear and descriptive commit message.
2. Push your changes to your forked repository.
3. Create a Pull Request (PR) to the main repository.
4. In your PR description, explain the changes you've made and why they're necessary.

### Code Style and Standards
- Follow the existing code style in the project.
- Use meaningful variable and function names.
- Comment your code where necessary, especially for complex logic.
- Ensure your code is compatible with major modern browsers.

### Testing
- Test your changes thoroughly in different browsers.
- If adding new functionality, consider adding appropriate test cases.

### Review Process
- All contributions will be reviewed by the project maintainers.
- Be open to feedback and be prepared to make changes to your PR if requested.
- Respectful communication is expected from all contributors.

By following these guidelines, you help maintain the quality and consistency of the Ethereum Obituaries project. Thank you for your contribution!