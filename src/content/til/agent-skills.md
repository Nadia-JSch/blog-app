---
title: "What are agent skills?"
date: "2026-02-12"
description: "Write instructions, add scripts, and other reference material for AI agents"
tags: ["css"]
---

Thinking of AI agents (like Claude Code and Codex) as an 'input' not an improves the output of the agent. Quality information and prompts provided to the agent makes it deliver better results. 

Agent skills are kind of like an organized CLAUDE.md file with global information about a project and what the agent is expected to do. 

## Create a skills folder

First create `skills/` folder in a hidden agent folder to keep all the skills in one place. 

```bash
.claude/
└── skills/
    └── skill-name/
        ├── SKILL.md          # Required: instructions + metadata
        ├── scripts/          # Optional: executable code
        ├── references/       # Optional: documentation
        └── assets/           # Optional: templates, resources
```

## Create a skill

Create a subfolder named after the skill which will contain the required SKILL.md folder.

### Add the Skill.md frontmatter

Add this frontmatter to SKILLS.md including a description about what the skill does. The agent refers to this.

```yaml
---
name: format-as-csv
description: Identify grammar and formatting issues on a particular page.
disable-model-invocation: true
---
```

The skill `name` is in kebab-case and the `description` in normal text. It makes sense for the skill name to match that skill's folder name.

### Disable mode invocation

Stop the Claude agent from using the skill whenever it decides to by adding this to the SKILL.md frontmatter.

```bash
disable-model-invocation: true
```

Now the agent performs the skill only when called.

## Call a skill

Use a backslash `\` followed by the skill name to call the skill within the agent.

```bash
\format-as-csv <argument>
```

## Add arguments when expanding on the skill

Use `$ARGUMENTS[0]` syntax in SKILL.md when describing the skill to pass in values to when invoking the skill. 

```
Format text file $ARGUMENTS[0] into CSV, creating a CSV file called $ARGUMENTS[1] as output.
```

## (Re)sources

- [Agent Skills](https://agentskills.io/what-are-skills)
- [Claude Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)