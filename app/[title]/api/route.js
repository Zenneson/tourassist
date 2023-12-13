const fireFetcher = async (url) => {
  const query = collectionGroup(firestore, "trips");
  const querySnapshot = await getDocs(query);
  const tripDoc = querySnapshot.docs.find((doc) => doc.id === url);
  if (!tripDoc) {
    throw new Error("No document found with the matching 'title'");
  }
  return tripDoc.data();
};

export const getStaticPaths = async () => {
  const queryData = collectionGroup(firestore, "trips");
  let paths = [];

  try {
    const querySnapshot = await getDocs(queryData);
    paths = querySnapshot.docs.map((doc) => {
      const title = doc.id;
      return { params: { title } };
    });
  } catch (error) {
    console.error(error);
  }

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { title } = params;
  const query = collectionGroup(firestore, "trips");
  try {
    const querySnapshot = await getDocs(query);
    const tripDoc = querySnapshot.docs.find((doc) => doc.id === title);
    if (!tripDoc) {
      console.log(
        "No document found with the matching the path used in Firebase"
      );
      return {
        notFound: true,
      };
    }

    const trip = tripDoc.data();
    return {
      props: {
        trip,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  }
};
