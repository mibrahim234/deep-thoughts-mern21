import React from 'react';
import { useParams } from 'react-router-dom';
// to get info on the thought id 

import ReactionList from '../components/ReactionList';
// reaction component

import { QUERY_THOUGHT } from '../utils/queries';
import { useQuery } from '@apollo/client';
// import queries.js/ apolloclient

const SingleThought = (props) => {
  const { id: thoughtId } = useParams();
  // Notice how the URL includes the ID of the thought being viewed.(in single thought component)
  // We can grab that ID and query the database for the thought's full information.

  const { loading, data } = useQuery(QUERY_THOUGHT, {
    // the variables loading and data are destructured from the useQuery Hook

    // the loading variable is then used to briefly show a loading <div> element, and the data variable is used to populate a thought object.
    variables: { id: thoughtId },
  });
  // The useQuery Hook was given a second argument in the form of an object.
  // This is how you can pass variables to queries that need them.
  // The id property on the variables object will become the $id parameter in the GraphQL query.

  const thought = data?.thought || {};

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          <span style={{ fontWeight: 700 }} className="text-light">
            {thought.username}
          </span>{' '}
          thought on {thought.createdAt}
        </p>
        <div className="card-body">
          <p>{thought.thoughtText}</p>
        </div>
      </div>

      {thought.reactionCount > 0 && (
        <ReactionList reactions={thought.reactions} />
      )}
    </div>
  );
};
// The only new addition is adding the ReactionList component at the bottom, passing in the reactions array as a prop. 
// We combined this with a thought.reactionCount > 0 expression to prevent rendering the reactions if the array is empty.

export default SingleThought;
