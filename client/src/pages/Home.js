import React from 'react';
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
import ThoughtForm from '../components/ThoughtForm';



import Auth from '../utils/auth';
// check for logged in status of user
import { useQuery } from '@apollo/client';
// importing the useQuery Hook from Apollo Client. 
// This will allow us to make requests to the GraphQL server we connected to and made available to the application using the <ApolloProvider> component in App.js.
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
// import queries from utils folder


// When we load the Home component in the application, we'll execute the query for the thought data.
const Home = () => {
  // use useQuery hook to make query request
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  //  Because this is asynchronous, just like using fetch(), apollo/client library provides a loading property to indicate that the request isn't done just yet. 
  // When it's finished and we have data returned from the server, that information is stored in the destructured data property.

  // with the loading property, we'll be able to conditionally render data based on whether or not there is data to even display.

  // use object destructuring to extract `data` from the `useQuery` Hook's response and rename it `userData` to be more descriptive
  const { data: userData } = useQuery(QUERY_ME_BASIC);
  // when the component function runs, we execute the QUERY_ME_BASIC query to retrieve the logged-in user's friend list to be printed.

  // get the thought data out of the query's response
  // response comes in big data object so use . to access data
const thoughts = data?.thoughts || [];
// optional chaining (new to js)
// we're saying is, if data exists, store it in the thoughts constant we just created. If data is undefined, then save an empty array to the thoughts component.
 
const loggedIn = Auth.loggedIn();
// If you're logged in, the loggedIn variable will be true; otherwise, it will be false

//(38-48) With this in place, we're conditionally defining the layout for this <div>. If the user isn't logged in, it'll span the full width of the row. But if you the user is logged in, it'll only span eight columns, leaving space for a four-column <div> on the righthand side.

// 44-48 conditionally render thoughtform
return (
  <main>
    <div className="flex-row justify-space-between">
      {loggedIn && (
        <div className="col-12 mb-3">
          <ThoughtForm />
        </div>
      )}
      <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ThoughtList
            thoughts={thoughts}
            title="Some Feed for Thought(s)..."
          />
        )}
      </div>
      {loggedIn && userData ? (
        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={userData.me.username}
            friendCount={userData.me.friendCount}
            friends={userData.me.friends}
          />
        </div>
      ) : null}
    </div>
  </main>
);
};
// (51-59): Now if the value of loggedIn is true and there is data in the userData variable we created from the useQuery() Hook, we'll render a righthand column <div> that holds our <FriendList> component!


// ^With this, we use a ternary operator to conditionally render the <ThoughtList> component. 

// If the query hasn't completed and loading is still defined, we display a message to indicate just that.

//  Once the query is complete and loading is undefined, we pass the thoughts array and a custom title to the <ThoughtList> component as props.
  

export default Home;
