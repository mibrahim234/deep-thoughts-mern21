import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
// Redirect will allow us to redirect the user to another route within the application.

import ThoughtForm from '../components/ThoughtForm';
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
// profile page relies on query_me to populate thoughts 

import { ADD_FRIEND } from '../utils/mutations';
import Auth from '../utils/auth';

const Profile = (props) => {
  const { username: userParam } = useParams();

// we need to destructure the mutation function from ADD_FRIEND so we can use it in a click function.
const [addFriend] = useMutation(ADD_FRIEND);
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });
// check the value of our parameter and conditionally run a query based on the result
// Now if there's a value in userParam that we got from the URL bar, we'll use that value to run the QUERY_USER query. If there's no value in userParam, like if we simply visit /profile as a logged-in user, we'll execute the QUERY_ME query instead.

  const user = data?.me || data?.user || {};

  // redirect to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Redirect to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  // if there is no user data to display, we know that we aren't logged in or at another user's profile page. 
  // Instead of redirecting the user away, we simply inform them that they need to be logged in to see this page and they must log in or sign up to use it.
  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  // callback function for button 
  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id },
      });
    } catch (e) {
      console.error(e);
    }
  };

  // 44-46: adjust the messaging displayed to a user on their profile page
  // if userParam doesn't exist, we'll get a message saying "Viewing your profile." Otherwise, it will display the username of the other user on their profile.

  // 61-69: include button element
  // Note that the <button> element has an onClick attribute. We'll need to define the callback function that it references above 

  // 70-74: the userParam variable is only defined when the route includes a username (e.g., /profile/Marisa86). 
  // Thus, the button won't display when the route is simply /profile.
  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>

        {userParam && (
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList
            thoughts={user.thoughts}
            title={`${user.username}'s thoughts...`}
          />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
      <div className="mb-3">{!userParam && <ThoughtForm />}</div>
    </div>
  );
};
export default Profile;

// 96: make sure the form only displays on the user's own Profile page, not on other users' pages.