import ProfileContent from "@/components/private/views/matriz/profile/profile-content";
import ProfileHeader from "@/components/private/views/matriz/profile/profile-header";


export default function Profile() {
  return (
    <section className="flex flex-col gap-5  ">
      <ProfileHeader />
      <ProfileContent />
    </section>
  );
}
