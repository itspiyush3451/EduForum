import PropTypes from "prop-types";
import NoticeCard from "./NoticeCard";

const NoticeList = ({
  notices,
  userNames,
  isTeacher,
  onEdit,
  onDelete,
  onDownload,
  isDarkMode,
}) => {
  if (notices.length === 0) {
    return (
      <div
        className={`text-center py-12 ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <p className="text-lg">No notices found</p>
        <p className="text-sm mt-2">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notices.map((notice) => (
        <NoticeCard
          key={notice.noticeid}
          notice={notice}
          userNames={userNames}
          isTeacher={isTeacher}
          onEdit={onEdit}
          onDelete={onDelete}
          onDownload={onDownload}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
};

NoticeList.propTypes = {
  notices: PropTypes.arrayOf(
    PropTypes.shape({
      noticeid: PropTypes.number.isRequired,
    })
  ).isRequired,
  userNames: PropTypes.object.isRequired,
  isTeacher: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default NoticeList;
