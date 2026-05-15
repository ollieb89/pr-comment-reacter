const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const token = core.getInput('token');
    const reactionsInput = core.getInput('reactions');
    let reactionsMap;
    
    try {
      reactionsMap = JSON.parse(reactionsInput);
    } catch (e) {
      throw new Error(`Invalid JSON for reactions input: ${e.message}`);
    }
    
    const octokit = github.getOctokit(token);
    const context = github.context;

    const eventName = context.eventName;
    core.info(`Event: ${eventName}`);

    if (eventName !== 'issue_comment' && eventName !== 'pull_request_review_comment' && eventName !== 'pull_request_review') {
      core.info('Not a supported comment event, skipping.');
      return;
    }

    let comments = [];
    if (eventName === 'pull_request_review') {
      // For PR reviews, we might want to react to the review body if it exists
      if (context.payload.review && context.payload.review.body) {
        comments.push({
          body: context.payload.review.body,
          id: context.payload.review.id,
          type: 'pull_request_review'
        });
      }
    } else {
      comments.push({
        body: context.payload.comment.body,
        id: context.payload.comment.id,
        type: eventName
      });
    }

    for (const comment of comments) {
      const commentBody = comment.body.toLowerCase();
      for (const [keyword, reaction] of Object.entries(reactionsMap)) {
        if (commentBody.includes(keyword.toLowerCase())) {
          core.info(`Keyword "${keyword}" found. Reacting with "${reaction}"...`);
          
          try {
            if (comment.type === 'issue_comment') {
              await octokit.rest.reactions.createForIssueComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: comment.id,
                content: reaction
              });
            } else if (comment.type === 'pull_request_review_comment') {
              await octokit.rest.reactions.createForPullRequestReviewComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: comment.id,
                content: reaction
              });
            } else if (comment.type === 'pull_request_review') {
              await octokit.rest.reactions.createForPullRequestReview({
                owner: context.repo.owner,
                repo: context.repo.repo,
                review_id: comment.id,
                content: reaction
              });
            }
          } catch (err) {
            core.warning(`Failed to add reaction "${reaction}": ${err.message}`);
          }
        }
      }
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
