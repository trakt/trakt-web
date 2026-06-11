<script lang="ts">
  import AndroidIcon from "$lib/components/icons/AndroidIcon.svelte";
  import AnticipatedIcon from "$lib/components/icons/AnticipatedIcon.svelte";
  import AppleIcon from "$lib/components/icons/AppleIcon.svelte";
  import ArrowLeftIcon from "$lib/components/icons/ArrowLeftIcon.svelte";
  import ArrowRightIcon from "$lib/components/icons/ArrowRightIcon.svelte";
  import BlockIcon from "$lib/components/icons/BlockIcon.svelte";
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import CastIcon from "$lib/components/icons/CastIcon.svelte";
  import CelebrationIcon from "$lib/components/icons/CelebrationIcon.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import CheckInIcon from "$lib/components/icons/CheckInIcon.svelte";
  import CircularLogo from "$lib/components/icons/CircularLogo.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import CoverImageIcon from "$lib/components/icons/CoverImageIcon.svelte";
  import CrewIcon from "$lib/components/icons/CrewIcon.svelte";
  import CustomLibraryIcon from "$lib/components/icons/CustomLibraryIcon.svelte";
  import DeleteIcon from "$lib/components/icons/DeleteIcon.svelte";
  import DiscoverIcon from "$lib/components/icons/DiscoverIcon.svelte";
  import DismissIcon from "$lib/components/icons/DismissIcon.svelte";
  import DropIcon from "$lib/components/icons/DropIcon.svelte";
  import EditModeIcon from "$lib/components/icons/EditModeIcon.svelte";
  import ExternalLinkIcon from "$lib/components/icons/ExternalLinkIcon.svelte";
  import FacebookIcon from "$lib/components/icons/FacebookIcon.svelte";
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import FilterIcon from "$lib/components/icons/FilterIcon.svelte";
  import FlagIcon from "$lib/components/icons/FlagIcon.svelte";
  import FollowIcon from "$lib/components/icons/FollowIcon.svelte";
  import FollowersIcon from "$lib/components/icons/FollowersIcon.svelte";
  import FollowingIcon from "$lib/components/icons/FollowingIcon.svelte";
  import GearIcon from "$lib/components/icons/GearIcon.svelte";
  import GithubIcon from "$lib/components/icons/GithubIcon.svelte";
  import GlobeIcon from "$lib/components/icons/GlobeIcon.svelte";
  import HideIcon from "$lib/components/icons/HideIcon.svelte";
  import HourglassIcon from "$lib/components/icons/HourglassIcon.svelte";
  import IMDBIcon from "$lib/components/icons/IMDBIcon.svelte";
  import IMDBSquareIcon from "$lib/components/icons/IMDBSquareIcon.svelte";
  import InfoIcon from "$lib/components/icons/InfoIcon.svelte";
  import InstagramIcon from "$lib/components/icons/InstagramIcon.svelte";
  import InstallIcon from "$lib/components/icons/InstallIcon.svelte";
  import JustWatchIcon from "$lib/components/icons/JustWatchIcon.svelte";
  import LibraryIcon from "$lib/components/icons/LibraryIcon.svelte";
  import LikeIcon from "$lib/components/icons/LikeIcon.svelte";
  import LoaderIcon from "$lib/components/icons/LoaderIcon.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import LogoutIcon from "$lib/components/icons/LogoutIcon.svelte";
  import MediaIcon from "$lib/components/icons/MediaIcon.svelte";
  import MenuIcon from "$lib/components/icons/MenuIcon.svelte";
  import MoreIcon from "$lib/components/icons/MoreIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import NoSpoilerIcon from "$lib/components/icons/NoSpoilerIcon.svelte";
  import NotesIcon from "$lib/components/icons/NotesIcon.svelte";
  import OfficialSiteIcon from "$lib/components/icons/OfficialSiteIcon.svelte";
  import PeopleIcon from "$lib/components/icons/PeopleIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import PlexLibraryIcon from "$lib/components/icons/PlexLibraryIcon.svelte";
  import PlexLogo from "$lib/components/icons/PlexLogo.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import PopcornIcon from "$lib/components/icons/PopcornIcon.svelte";
  import PopularIcon from "$lib/components/icons/PopularIcon.svelte";
  import PostMessageIcon from "$lib/components/icons/PostMessageIcon.svelte";
  import ProfileIcon from "$lib/components/icons/ProfileIcon.svelte";
  import QuestionIcon from "$lib/components/icons/QuestionIcon.svelte";
  import RatingIcon from "$lib/components/icons/RatingIcon.svelte";
  import RatingsIcon from "$lib/components/icons/RatingsIcon.svelte";
  import ReactionIcon from "$lib/components/icons/ReactionIcon.svelte";
  import RecentIcon from "$lib/components/icons/RecentIcon.svelte";
  import RedditIcon from "$lib/components/icons/RedditIcon.svelte";
  import RemainingIcon from "$lib/components/icons/RemainingIcon.svelte";
  import RemoveIcon from "$lib/components/icons/RemoveIcon.svelte";
  import RenameIcon from "$lib/components/icons/RenameIcon.svelte";
  import ReplyIcon from "$lib/components/icons/ReplyIcon.svelte";
  import RestoreIcon from "$lib/components/icons/RestoreIcon.svelte";
  import RottenIcon from "$lib/components/icons/RottenIcon.svelte";
  import ScrollLeftIcon from "$lib/components/icons/ScrollLeftIcon.svelte";
  import ScrollRightIcon from "$lib/components/icons/ScrollRightIcon.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import SentimentIcon from "$lib/components/icons/SentimentIcon.svelte";
  import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import SmartListIcon from "$lib/components/icons/SmartListIcon.svelte";
  import SocialIcon from "$lib/components/icons/SocialIcon.svelte";
  import SortAlphaIcon from "$lib/components/icons/SortAlphaIcon.svelte";
  import SortDirectionIcon from "$lib/components/icons/SortDirectionIcon.svelte";
  import SortIcon from "$lib/components/icons/SortIcon.svelte";
  import SparkleIcon from "$lib/components/icons/SparkleIcon.svelte";
  import SpoilerIcon from "$lib/components/icons/SpoilerIcon.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import StopIcon from "$lib/components/icons/StopIcon.svelte";
  import SwitchIcon from "$lib/components/icons/SwitchIcon.svelte";
  import TMDBIcon from "$lib/components/icons/TMDBIcon.svelte";
  import ThumbsUpIcon from "$lib/components/icons/ThumbsUpIcon.svelte";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import TrendIcon from "$lib/components/icons/TrendIcon.svelte";
  import VisibilityIcon from "$lib/components/icons/VisibilityIcon.svelte";
  import WatchersIcon from "$lib/components/icons/WatchersIcon.svelte";
  import WatchNowIcon from "$lib/components/icons/WatchNowIcon.svelte";
  import WikipediaIcon from "$lib/components/icons/WikipediaIcon.svelte";
  import XIcon from "$lib/components/icons/XIcon.svelte";
  import YouTubeIcon from "$lib/components/icons/YouTubeIcon.svelte";
  import HomeIcon from "$lib/components/icons/mobile/HomeIcon.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import IconTile from "./_internal/IconTile.svelte";
</script>

<main>
  <div class="icon-groups">
    <section>
      <h2>Navigation</h2>
      <div class="icon-grid">
        <IconTile name="ArrowLeftIcon"><ArrowLeftIcon /></IconTile>
        <IconTile name="ArrowRightIcon"><ArrowRightIcon /></IconTile>
        <IconTile name="CaretLeftIcon"><CaretLeftIcon /></IconTile>
        <IconTile name="CaretRightIcon"><CaretRightIcon /></IconTile>
        <IconTile name="CloseIcon"><CloseIcon /></IconTile>
        <IconTile name="DismissIcon"><DismissIcon /></IconTile>
        <IconTile name="ExternalLinkIcon"><ExternalLinkIcon /></IconTile>
        <IconTile name="HomeIcon"><HomeIcon /></IconTile>
        <IconTile name="ListIcon"><ListIcon /></IconTile>
        <IconTile name="MenuIcon"><MenuIcon /></IconTile>
        <IconTile name="MenuIcon open"><MenuIcon state="open" /></IconTile>
        <IconTile name="MoreIcon"><MoreIcon /></IconTile>
        <IconTile name="ScrollLeftIcon"><ScrollLeftIcon /></IconTile>
        <IconTile name="ScrollRightIcon"><ScrollRightIcon /></IconTile>
      </div>
    </section>

    <section>
      <h2>Media</h2>
      <div class="icon-grid">
        <IconTile name="AnticipatedIcon"><AnticipatedIcon /></IconTile>
        <IconTile name="BookmarkIcon missing">
          <BookmarkIcon state="missing" />
        </IconTile>
        <IconTile name="BookmarkIcon added">
          <BookmarkIcon state="added" />
        </IconTile>
        <IconTile name="CalendarIcon"><CalendarIcon /></IconTile>
        <IconTile name="CastIcon"><CastIcon /></IconTile>
        <IconTile name="CheckInIcon"><CheckInIcon /></IconTile>
        <IconTile name="ClockIcon"><ClockIcon /></IconTile>
        <IconTile name="CommentIcon"><CommentIcon /></IconTile>
        <IconTile name="CommentIcon filled">
          <CommentIcon style="filled" />
        </IconTile>
        <IconTile name="CoverImageIcon"><CoverImageIcon /></IconTile>
        <IconTile name="CrewIcon"><CrewIcon /></IconTile>
        <IconTile name="DiscoverIcon"><DiscoverIcon /></IconTile>
        <IconTile name="DropIcon"><DropIcon /></IconTile>
        <IconTile name="FavoriteIcon"><FavoriteIcon /></IconTile>
        <IconTile name="FavoriteIcon filled">
          <FavoriteIcon state="filled" />
        </IconTile>
        <IconTile name="HideIcon"><HideIcon /></IconTile>
        <IconTile name="HourglassIcon"><HourglassIcon /></IconTile>
        <IconTile name="LibraryIcon"><LibraryIcon /></IconTile>
        <IconTile name="MediaIcon"><MediaIcon /></IconTile>
        <IconTile name="MovieIcon"><MovieIcon /></IconTile>
        <IconTile name="NoSpoilerIcon"><NoSpoilerIcon /></IconTile>
        <IconTile name="NotesIcon"><NotesIcon /></IconTile>
        <IconTile name="NotesIcon active"><NotesIcon active /></IconTile>
        <IconTile name="PeopleIcon"><PeopleIcon /></IconTile>
        <IconTile name="PlayIcon"><PlayIcon /></IconTile>
        <IconTile name="PopularIcon"><PopularIcon /></IconTile>
        <IconTile name="ProfileIcon"><ProfileIcon /></IconTile>
        <IconTile name="RecentIcon"><RecentIcon /></IconTile>
        <IconTile name="RemainingIcon"><RemainingIcon /></IconTile>
        <IconTile name="ShowIcon"><ShowIcon /></IconTile>
        <IconTile name="SpoilerIcon"><SpoilerIcon /></IconTile>
        <IconTile name="StopIcon"><StopIcon /></IconTile>
        <IconTile name="SwitchIcon"><SwitchIcon /></IconTile>
        <IconTile name="TrackIcon"><TrackIcon /></IconTile>
        <IconTile name="WatchersIcon"><WatchersIcon /></IconTile>
        <IconTile name="WatchNowIcon"><WatchNowIcon /></IconTile>
      </div>
    </section>

    <section>
      <h2>Actions</h2>
      <div class="icon-grid">
        <IconTile name="BlockIcon"><BlockIcon /></IconTile>
        <IconTile name="CheckIcon"><CheckIcon /></IconTile>
        <IconTile name="DeleteIcon"><DeleteIcon /></IconTile>
        <IconTile name="EditModeIcon"><EditModeIcon /></IconTile>
        <IconTile name="FilterIcon"><FilterIcon state="unfiltered" /></IconTile>
        <IconTile name="FilterIcon filtered">
          <FilterIcon state="filtered" />
        </IconTile>
        <IconTile name="FlagIcon"><FlagIcon /></IconTile>
        <IconTile name="FollowIcon followed">
          <FollowIcon state="followed" />
        </IconTile>
        <IconTile name="FollowIcon unfollowed">
          <FollowIcon state="unfollowed" />
        </IconTile>
        <IconTile name="InfoIcon"><InfoIcon /></IconTile>
        <IconTile name="InstallIcon"><InstallIcon /></IconTile>
        <IconTile name="LikeIcon"><LikeIcon /></IconTile>
        <IconTile name="LikeIcon filled"><LikeIcon style="filled" /></IconTile>
        <IconTile name="LockIcon"><LockIcon /></IconTile>
        <IconTile name="LogoutIcon"><LogoutIcon /></IconTile>
        <IconTile name="PlusIcon"><PlusIcon /></IconTile>
        <IconTile name="PostMessageIcon"><PostMessageIcon /></IconTile>
        <IconTile name="PostMessageIcon filled">
          <PostMessageIcon style="filled" />
        </IconTile>
        <IconTile name="QuestionIcon"><QuestionIcon /></IconTile>
        <IconTile name="ReactionIcon"><ReactionIcon state="default" /></IconTile>
        <IconTile name="ReactionIcon add">
          <ReactionIcon state="add" />
        </IconTile>
        <IconTile name="ReactionIcon edit">
          <ReactionIcon state="edit" />
        </IconTile>
        <IconTile name="RemoveIcon"><RemoveIcon /></IconTile>
        <IconTile name="RenameIcon"><RenameIcon /></IconTile>
        <IconTile name="ReplyIcon"><ReplyIcon /></IconTile>
        <IconTile name="RestoreIcon"><RestoreIcon /></IconTile>
        <IconTile name="SearchIcon"><SearchIcon /></IconTile>
        <IconTile name="ShareIcon"><ShareIcon /></IconTile>
        <IconTile name="SortAlphaIcon"><SortAlphaIcon /></IconTile>
        <IconTile name="SortDirectionIcon asc">
          <SortDirectionIcon direction="asc" />
        </IconTile>
        <IconTile name="SortDirectionIcon desc">
          <SortDirectionIcon direction="desc" />
        </IconTile>
        <IconTile name="SortIcon"><SortIcon /></IconTile>
        <IconTile name="VisibilityIcon visible">
          <VisibilityIcon state="visible" />
        </IconTile>
        <IconTile name="VisibilityIcon hidden">
          <VisibilityIcon state="hidden" />
        </IconTile>
      </div>
    </section>

    <section>
      <h2>Ratings</h2>
      <div class="icon-grid">
        <IconTile name="IMDBIcon"><IMDBIcon /></IconTile>
        <IconTile name="IMDBSquareIcon"><IMDBSquareIcon /></IconTile>
        <IconTile name="PopcornIcon hot"><PopcornIcon style="hot" /></IconTile>
        <IconTile name="PopcornIcon stale">
          <PopcornIcon style="stale" />
        </IconTile>
        <IconTile name="RatingIcon trakt"><RatingIcon /></IconTile>
        <IconTile name="RatingIcon user">
          <RatingIcon variant="user" />
        </IconTile>
        <IconTile name="RatingsIcon"><RatingsIcon /></IconTile>
        <IconTile name="RottenIcon fresh"><RottenIcon /></IconTile>
        <IconTile name="RottenIcon rotten">
          <RottenIcon style="rotten" />
        </IconTile>
        <IconTile name="SentimentIcon good">
          <SentimentIcon sentiment="good" />
        </IconTile>
        <IconTile name="SentimentIcon bad">
          <SentimentIcon sentiment="bad" />
        </IconTile>
        <IconTile name="StarIcon none"><StarIcon fill="none" /></IconTile>
        <IconTile name="StarIcon half"><StarIcon fill="half" /></IconTile>
        <IconTile name="StarIcon full"><StarIcon fill="full" /></IconTile>
        <IconTile name="ThumbsUpIcon"><ThumbsUpIcon /></IconTile>
        <IconTile name="TrendIcon up"><TrendIcon direction="up" /></IconTile>
        <IconTile name="TrendIcon down">
          <TrendIcon direction="down" />
        </IconTile>
      </div>
    </section>

    <section>
      <h2>Brands</h2>
      <div class="icon-grid">
        <IconTile name="AndroidIcon"><AndroidIcon /></IconTile>
        <IconTile name="AppleIcon"><AppleIcon /></IconTile>
        <IconTile name="CircularLogo"><CircularLogo /></IconTile>
        <IconTile name="FacebookIcon"><FacebookIcon /></IconTile>
        <IconTile name="GithubIcon"><GithubIcon /></IconTile>
        <IconTile name="GlobeIcon"><GlobeIcon /></IconTile>
        <IconTile name="InstagramIcon"><InstagramIcon /></IconTile>
        <IconTile name="JustWatchIcon"><JustWatchIcon /></IconTile>
        <IconTile name="OfficialSiteIcon"><OfficialSiteIcon /></IconTile>
        <IconTile name="PlexLogo"><PlexLogo /></IconTile>
        <IconTile name="RedditIcon"><RedditIcon /></IconTile>
        <IconTile name="TMDBIcon"><TMDBIcon /></IconTile>
        <IconTile name="WikipediaIcon"><WikipediaIcon /></IconTile>
        <IconTile name="XIcon"><XIcon /></IconTile>
        <IconTile name="YouTubeIcon"><YouTubeIcon /></IconTile>
      </div>
    </section>

    <section>
      <h2>Library & Social</h2>
      <div class="icon-grid">
        <IconTile name="CustomLibraryIcon"><CustomLibraryIcon /></IconTile>
        <IconTile name="FollowersIcon"><FollowersIcon /></IconTile>
        <IconTile name="FollowingIcon"><FollowingIcon /></IconTile>
        <IconTile name="PlexLibraryIcon"><PlexLibraryIcon /></IconTile>
        <IconTile name="SmartListIcon"><SmartListIcon /></IconTile>
        <IconTile name="SocialIcon"><SocialIcon /></IconTile>
      </div>
    </section>

    <section>
      <h2>System</h2>
      <div class="icon-grid">
        <IconTile name="CelebrationIcon"><CelebrationIcon /></IconTile>
        <IconTile name="GearIcon"><GearIcon /></IconTile>
        <IconTile name="LoaderIcon"><LoaderIcon /></IconTile>
        <IconTile name="LoadingIndicator"><LoadingIndicator /></IconTile>
        <IconTile name="SparkleIcon"><SparkleIcon /></IconTile>
      </div>
    </section>
  </div>
</main>

<style lang="scss">
  main,
  .icon-groups,
  section {
    display: flex;
    flex-direction: column;
  }

  main {
    gap: var(--gap-xl);
    padding-block: var(--ni-32);
    align-items: center;
  }

  .icon-groups {
    gap: var(--gap-xl);
    width: min(var(--ni-920), calc(100% - var(--ni-32)));
  }

  section {
    gap: var(--gap-m);
  }

  .icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--ni-144), 1fr));
    gap: var(--gap-m);
  }
</style>
