# Chirpy Starter

[![Gem Version](https://img.shields.io/gem/v/jekyll-theme-chirpy)][gem]&nbsp;
[![GitHub license](https://img.shields.io/github/license/cotes2020/chirpy-starter.svg?color=blue)][mit]

When installing the [**Chirpy**][chirpy] theme through [RubyGems.org][gem], Jekyll can only read files in the folders
`_data`, `_layouts`, `_includes`, `_sass` and `assets`, as well as a small part of options of the `_config.yml` file
from the theme's gem. If you have ever installed this theme gem, you can use the command
`bundle info --path jekyll-theme-chirpy` to locate these files.

The Jekyll team claims that this is to leave the ball in the user’s court, but this also results in users not being
able to enjoy the out-of-the-box experience when using feature-rich themes.

To fully use all the features of **Chirpy**, you need to copy the other critical files from the theme's gem to your
Jekyll site. The following is a list of targets:

```shell
.
├── _config.yml
├── _plugins
├── _tabs
└── index.html
```

To save you time, and also in case you lose some files while copying, we extract those files/configurations of the
latest version of the **Chirpy** theme and the [CD][CD] workflow to here, so that you can start writing in minutes.

## Usage

Check out the [theme's docs](https://github.com/cotes2020/jekyll-theme-chirpy/wiki).

## How to create a post

To create a new blog post via GitHub Issues:

1.  **Open an Issue**: Create a new issue in this repository.
2.  **Title**: The issue title will be used as the post title.
3.  **Content**:
    *   **Tags**: Add a line like `tags: tag1, tag2`.
    *   **Categories**: Add a line like `categories: cat1, cat2`.
    *   **GPX Track**: To include an interactive map with a GPX track:
        1.  Upload your `.gpx` file to the repository (e.g., in `assets/gpx/`).
        2.  Add a line in the issue body: `gpx: assets/gpx/your-track.gpx`.
    *   **Body**: The rest of the issue body will be the post content.
4.  **Label**: Add the `new-post` label to the issue.
5.  **Automation**: A GitHub Action will create the post and close the issue. If an error occurs (e.g., the GPX file is missing), a comment will be posted on the issue.

## Contributing

This repository is automatically updated with new releases from the theme repository. If you encounter any issues or want to contribute to its improvement, please visit the [theme repository][chirpy] to provide feedback.

## License

This work is published under [MIT][mit] License.

[gem]: https://rubygems.org/gems/jekyll-theme-chirpy
[chirpy]: https://github.com/cotes2020/jekyll-theme-chirpy/
[CD]: https://en.wikipedia.org/wiki/Continuous_deployment
[mit]: https://github.com/cotes2020/chirpy-starter/blob/master/LICENSE
