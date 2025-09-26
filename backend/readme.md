prompt ID:

pmpt_68d666ee516c819081022ca8db1ae08201c8b212104aeb4f



example

from openai import OpenAI
client = OpenAI()

response = client.responses.create(
  prompt={
    "id": "pmpt_68d666ee516c819081022ca8db1ae08201c8b212104aeb4f",
    "version": "1"
  }
)