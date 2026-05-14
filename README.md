# PR Comment Reacter

Automatically react to pull request comments based on keywords.

## Usage

```yaml
- uses: ollieb89/pr-comment-reacter@v1.0.0
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    reactions: '{"LGTM": "heart", "shipit": "rocket"}'
```

## Reactions Map

The `reactions` input is a JSON map of keywords to reaction names.
Supported reactions: +1, -1, laugh, confused, heart, hooray, rocket, eyes.

## License

MIT
