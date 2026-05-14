const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const token = core.getInput('token');
    const reactionsInput = core.getInput('reactions');
    const reactionsMap = JSON.parse(reactionsInput);
    
    const octokit = github.getOctokit(token);
    const context = github.context;

    if (context.eventName !== 'issue_comment' && context.eventName !== 'pull_request_review_comment') {
      core.info('Not a comment event, skipping.');
      return;
    }

    const comment = context.payload.comment;
    const commentBody = comment.body.toLowerCase();
    const commentId = comment.id;

    for (const [keyword, reaction] of Object.entries(reactionsMap)) {
      if (commentBody.includes(keyword.toLowerCase())) {
        core.info(`Keyword "${keyword}" found. Reacting with "${reaction}"...`);
        
        await octokit.rest.reactions.createForIssueComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          comment_id: commentId,
          content: reaction
        });
      }
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
