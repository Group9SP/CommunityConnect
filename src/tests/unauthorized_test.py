import requests

# Get this URL from your teammate or your browser's 'Network' tab
api_url = "https://your-api-id.appsync-api.us-east-1.amazonaws.com/graphql"

def test_unauthorized_access():
    query = {"query": "{ listUserData { items { id name } } }"}
    response = requests.post(api_url, json=query)
    
    if response.status_code == 401:
        print("✅ Success: Access denied as expected.")
    else:
        print(f"❌ Security Flaw: Accessed data with status {response.status_code}")

test_unauthorized_access()