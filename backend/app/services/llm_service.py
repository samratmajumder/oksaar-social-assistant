import os
import json
import requests
import random

# This is a mock implementation for the OpenAI API integration
# In a real implementation, this would use the actual OpenAI API client

class LLMService:
    def __init__(self, primary_api_key=None, secondary_api_key=None):
        self.primary_api_key = primary_api_key or os.environ.get('OPENAI_API_KEY', 'mock-primary-key')
        self.secondary_api_key = secondary_api_key or os.environ.get('SECONDARY_API_KEY', 'mock-secondary-key')
    
    def generate_post(self, user_profile, post_type='all'):
        # Extract relevant profile information
        name = user_profile.get('username', 'User')
        purpose = user_profile.get('purpose', 'share interesting content')
        tone = user_profile.get('tone', 'professional')
        topics = user_profile.get('topics', [])
        
        # Select a topic
        selected_topic = random.choice(topics) if topics else 'technology'
        
        # Create prompt
        prompt = f"""You are an intelligent social assistant for {name}. 
        Your purpose is to {purpose}. Write in a {tone} tone. 
        Generate a social media post about {selected_topic} in the requested format.
        Ensure it's unique and engaging."""
        
        # Mock response (in a real implementation, this would call the OpenAI API)
        if post_type == 'micro' or post_type == 'all':
            micro_post = self._generate_micro_post(selected_topic, tone)
        else:
            micro_post = None
            
        if post_type == 'short' or post_type == 'all':
            short_post = self._generate_short_post(selected_topic, tone, purpose)
        else:
            short_post = None
            
        if post_type == 'long' or post_type == 'all':
            long_post = self._generate_long_post(selected_topic, tone, purpose)
        else:
            long_post = None
        
        # Return the generated content
        return {
            'micro': micro_post,
            'short': short_post,
            'long': long_post,
            'topic': selected_topic
        }
    
    def _generate_micro_post(self, topic, tone):
        # Mock implementation for micro posts (X/Twitter)
        templates = [
            f"Just published a new article on {topic}! Check it out and let me know what you think. #{''.join(topic.split())} #ContentCreation",
            f"Interesting insight about {topic}: Did you know that innovation in this area has increased by 40% in the last year? #{''.join(topic.split())}",
            f"Looking for resources on {topic}? I've compiled a list of my favorites. Reply if you'd like me to share them! #{''.join(topic.split())} #Resources",
            f"Question for my network: How has {topic} impacted your work recently? Share your experiences below! #{''.join(topic.split())} #Discussion"
        ]
        
        return random.choice(templates)
    
    def _generate_short_post(self, topic, tone, purpose):
        # Mock implementation for short posts (LinkedIn)
        intro = f"I've been exploring {topic} recently and wanted to share some thoughts."
        
        points = [
            f"🔑 Key insight: {topic} is transforming how we approach challenges in our field.",
            f"📊 Recent data shows a 35% increase in adoption of {topic}-related solutions.",
            f"🔍 My research indicates that professionals who stay updated on {topic} tend to outperform their peers.",
            f"💡 One innovative approach to {topic} involves integrating it with complementary technologies.",
            f"🌐 Global trends suggest {topic} will continue to grow in importance over the next decade."
        ]
        
        outro = f"What's your experience with {topic}? I'd love to hear your thoughts in the comments below!"
        
        return intro + '\n\n' + '\n'.join(random.sample(points, 2)) + '\n\n' + outro
    
    def _generate_long_post(self, topic, tone, purpose):
        # Mock implementation for long posts (blog)
        title = f"Understanding the Impact of {topic.title()} in Today's Landscape"
        
        intro = f"# {title}\n\nIn recent years, {topic} has emerged as a critical factor in shaping how businesses and individuals operate. This post explores the key aspects of {topic} and why it matters for professionals today.\n"
        
        sections = [
            f"## The Evolution of {topic.title()}\n\n{topic.title()} has undergone significant transformation over the past decade. What started as a niche concept has now become mainstream, with applications spanning across industries. The rapid advancement in technology has played a crucial role in this evolution, making {topic} more accessible and effective.\n",
            
            f"## Key Benefits of Adopting {topic.title()} Strategies\n\n1. **Increased Efficiency**: Implementing {topic}-driven approaches can streamline operations and reduce redundancy.\n2. **Enhanced Decision Making**: Data from {topic} initiatives provides valuable insights for strategic planning.\n3. **Competitive Advantage**: Early adopters of {topic} methodologies often gain significant market advantage.\n4. **Scalability**: {topic} solutions typically offer greater scalability than traditional approaches.\n",
            
            f"## Challenges and Considerations\n\nDespite its benefits, adopting {topic} is not without challenges. Organizations must consider factors such as implementation costs, training requirements, and integration with existing systems. Moreover, staying updated with rapidly evolving {topic} trends requires continuous learning and adaptation.\n",
            
            f"## Best Practices for {topic.title()} Implementation\n\n- Start with clear objectives and metrics for success\n- Invest in proper training and resources\n- Begin with pilot projects before full-scale implementation\n- Establish feedback mechanisms to continuously improve\n- Partner with experienced professionals in the {topic} space\n"
        ]
        
        conclusion = f"## Conclusion\n\n{topic.title()} continues to reshape our professional landscape, offering both opportunities and challenges. By taking a strategic approach to {topic} adoption and staying informed about emerging trends, professionals can leverage its potential to drive meaningful results. I'm eager to hear about your experiences with {topic} - share your thoughts in the comments!"
        
        references = f"## Further Reading\n\n- Smith, J. (2023). The Future of {topic.title()}\n- {topic.title()} Institute Annual Report 2023\n- Johnson, A. & Williams, B. (2022). Implementing {topic.title()} at Scale"
        
        return intro + '\n' + '\n'.join(sections) + '\n\n' + conclusion + '\n\n' + references
    
    def generate_reply(self, original_post, reply_content, user_name, tone='friendly'):
        # Use the secondary (cheaper/free) LLM for replies
        # In a real implementation, this would use a different model or endpoint
        
        prompt = f"""You are {user_name}, replying to a comment on your post. 
        Keep it short, friendly, and in a {tone} tone, as if casually chatting with a friend. 
        Reply to: {reply_content}."""
        
        # Mock response templates
        templates = [
            f"Thanks for your comment! I appreciate your perspective on {original_post.get('topic', 'this topic')}.",
            f"Great point! I hadn't considered that angle before. What else do you think about {original_post.get('topic', 'this topic')}?",
            f"Thank you for engaging! I'm always interested in hearing different viewpoints on {original_post.get('topic', 'this topic')}.",
            f"You raise an interesting question about {original_post.get('topic', 'this topic')}. In my experience, it depends on the specific context.",
            f"I appreciate your feedback! It's valuable to get different perspectives on {original_post.get('topic', 'this topic')}."
        ]
        
        return random.choice(templates)
