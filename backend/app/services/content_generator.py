import os
import json
import requests
from PIL import Image
from io import BytesIO
import base64
import random

# Mock implementation for demo purposes
# In a real implementation, this would use the OpenAI API
def generate_post_content(user):
    # Extract user profile information
    topics = user.get('topics', [])
    purpose = user.get('purpose', 'share interesting content')
    tone = user.get('tone', 'professional')
    
    # Mock topic selection
    if topics:
        selected_topic = random.choice(topics)
    else:
        selected_topic = random.choice(['technology', 'artificial intelligence', 'business', 'productivity'])
    
    # Mock content generation
    content = {
        'micro': generate_micro_post(selected_topic, tone),
        'short': generate_short_post(selected_topic, tone, purpose),
        'long': generate_long_post(selected_topic, tone, purpose)
    }
    
    # Generate or select a mock image URL
    image_url = get_mock_image_url(selected_topic)
    
    return content, image_url

def generate_micro_post(topic, tone):
    # Simplified mock implementation for X posts (≤280 chars)
    templates = [
        f"Just published a new article on {topic}! Check it out and let me know what you think. #{''.join(topic.split())} #ContentCreation",
        f"Interesting insight about {topic}: Did you know that innovation in this area has increased by 40% in the last year? #{''.join(topic.split())}",
        f"Looking for resources on {topic}? I've compiled a list of my favorites. Reply if you'd like me to share them! #{''.join(topic.split())} #Resources",
        f"Question for my network: How has {topic} impacted your work recently? Share your experiences below! #{''.join(topic.split())} #Discussion"
    ]
    
    return random.choice(templates)

def generate_short_post(topic, tone, purpose):
    # Simplified mock implementation for LinkedIn posts (≤700 chars)
    intro = f"I've been exploring {topic} recently and wanted to share some thoughts."
    
    points = [
        f"🔑 Key insight: {topic} is transforming how we approach challenges in our field.",
        f"📊 Recent data shows a 35% increase in adoption of {topic}-related solutions.",
        f"🔍 My research indicates that professionals who stay updated on {topic} tend to outperform their peers."
    ]
    
    outro = f"What's your experience with {topic}? I'd love to hear your thoughts in the comments below!"
    
    return intro + '\n\n' + '\n'.join(random.sample(points, 2)) + '\n\n' + outro

def generate_long_post(topic, tone, purpose):
    # Simplified mock implementation for blog posts (detailed)
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

def get_mock_image_url(topic):
    # Mock function to return placeholder images
    image_urls = [
        "https://placehold.co/600x400/4285F4/FFFFFF/?text=" + topic.replace(' ', '+'),
        "https://placehold.co/800x600/34A853/FFFFFF/?text=" + topic.replace(' ', '+'),
        "https://placehold.co/900x500/FBBC05/FFFFFF/?text=" + topic.replace(' ', '+'),
        "https://placehold.co/1200x630/EA4335/FFFFFF/?text=" + topic.replace(' ', '+')
    ]
    
    return random.choice(image_urls)
