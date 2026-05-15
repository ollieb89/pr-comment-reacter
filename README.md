# PR Comment Reacter

Automatically reacts to Pull Request comments based on keywords.

## Usage

```yaml
uses: ollieb89/pr-comment-reacter@v1.0.0
with:
  reactions: '{"shipit": "rocket", "LGTM": "heart", "eyes": "eyes"}'
```

## Supported Events

- `issue_comment` (on PRs)
- `pull_request_review_comment`
- `pull_request_review` (reacts to the review summary body)

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `token` | GitHub Token | Yes | `${{ github.token }}` |
| `reactions` | JSON map of keywords to reactions | Yes | `{"shipit": "rocket", "LGTM": "heart"}` |

## Supported Reactions

`+1`, `-1`, `laugh`, `confused`, `heart`, `hooray`, `rocket`, `eyes`

## License

MIT
