/* Shared by the browser demo and Node boundary tests. No server identity layer. */
(function (root) {
  const policy = {
    canApprove(role, item) {
      return Boolean(role?.canApprove && item && item.stale === false && item.confidence >= 60);
    },
    canAdvance(role, task) {
      return Boolean(role?.canExecute && task && ["todo", "blocked", "doing", "verifying"].includes(task.status));
    }
  };
  if (typeof module !== "undefined") module.exports = policy;
  else root.LogisticsPolicy = policy;
})(globalThis);
