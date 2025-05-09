import TutorDetailsComponent from "@/components/modules/tutor/TutorDetailsComponent";

const TutorDetails = async ({
  params,
}: {
  params: Promise<{ tutorId: string }>;
}) => {
  const { tutorId } = await params;

  return (
    <div>
      <TutorDetailsComponent id={tutorId}></TutorDetailsComponent>
    </div>
  );
};

export default TutorDetails;
